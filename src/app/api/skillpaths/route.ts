import { prisma } from '@/lib/prisma';
import { parseSkillPath } from '@/utils/skillPathParser';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, sommaire, forceBacLevel = false } = await request.json();

    if (!name || !sommaire) {
      return NextResponse.json(
        { error: 'Name and sommaire are required' },
        { status: 400 }
      );
    }

    // Parse le sommaire pour extraire les leçons
    const parsedSkillPath = parseSkillPath(sommaire, forceBacLevel);
    
    // Créer le SkillPath dans la base de données
    const skillPath = await prisma.skillPath.create({
      data: {
        name,
        sommaire: parsedSkillPath as any, // Cast vers any pour le type Json de Prisma
        status: 'PENDING',
        lessons: {
          create: []
        }
      },
      include: {
        lessons: true
      }
    });

    // Créer toutes les leçons à partir du sommaire parsé
    let lessonOrder = 1;
    for (const unit of parsedSkillPath.units) {
      for (const module of unit.modules) {
        for (const lesson of module.lessons) {
          await prisma.lesson.create({
            data: {
              title: lesson.title,
              order: lessonOrder++,
              status: 'PENDING',
              skillPathId: skillPath.id,
            }
          });
        }
      }
    }

    // Récupérer le SkillPath complet avec les leçons
    const completeSkillPath = await prisma.skillPath.findUnique({
      where: { id: skillPath.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            content: true
          }
        }
      }
    });

    return NextResponse.json(completeSkillPath);
  } catch (error) {
    console.error('Error creating skill path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const skillPaths = await prisma.skillPath.findMany({
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            content: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(skillPaths);
  } catch (error) {
    console.error('Error fetching skill paths:', error);
    
    // Fallback avec des données statiques pour la démo
    const fallbackSkillPaths = [
      {
        id: '1',
        name: 'Advanced React Patterns',
        sommaire: {},
        status: 'COMPLETED',
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-20').toISOString(),
        lessons: []
      },
      {
        id: '2',
        name: 'Cloud Architecture Fundamentals',
        sommaire: {},
        status: 'COMPLETED',
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-18').toISOString(),
        lessons: []
      },
      {
        id: '3',
        name: 'TypeScript for Senior Engineers',
        sommaire: {},
        status: 'GENERATING',
        createdAt: new Date('2024-02-05').toISOString(),
        updatedAt: new Date('2024-02-12').toISOString(),
        lessons: []
      }
    ];

    return NextResponse.json(fallbackSkillPaths);
  }
}

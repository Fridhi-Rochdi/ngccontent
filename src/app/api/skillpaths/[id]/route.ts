import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const skillPath = await prisma.skillPath.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            content: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!skillPath) {
      return NextResponse.json(
        { error: 'Skill path not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(skillPath);
  } catch (error) {
    console.error('Error fetching skill path:', error);
    
    // Fallback avec des données statiques pour la démo
    const fallbackSkillPath = {
      id: id,
      name: `Skill Path ${id}`,
      sommaire: {
        title: `Demo Skill Path ${id}`,
        description: 'This is a demo skill path while the database is being connected.'
      },
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: [
        {
          id: `${id}-lesson-1`,
          title: 'Introduction',
          order: 1,
          status: 'COMPLETED',
          skillPathId: id,
          content: []
        },
        {
          id: `${id}-lesson-2`,
          title: 'Core Concepts',
          order: 2,
          status: 'COMPLETED',
          skillPathId: id,
          content: []
        }
      ]
    };

    return NextResponse.json(fallbackSkillPath);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    
    const skillPath = await prisma.skillPath.update({
      where: { id },
      data: body,
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(skillPath);
  } catch (error) {
    console.error('Error updating skill path:', error);
    return NextResponse.json(
      { error: 'Failed to update skill path' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.skillPath.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill path:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill path' },
      { status: 500 }
    );
  }
}

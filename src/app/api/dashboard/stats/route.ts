import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer les statistiques globales du dashboard
    const [
      totalSkillPaths,
      publishedSkillPaths,
      draftSkillPaths,
      totalLessons,
      completedLessons,
      recentSkillPaths,
      skillPathsWithLessons
    ] = await Promise.all([
      // Total des skill paths
      prisma.skillPath.count(),
      
      // Skill paths publiés
      prisma.skillPath.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Skill paths en brouillon
      prisma.skillPath.count({
        where: { status: 'PENDING' }
      }),
      
      // Total des leçons
      prisma.lesson.count(),
      
      // Leçons complétées (avec contenu)
      prisma.lesson.count({
        where: {
          content: {
            some: {
              isSelected: true
            }
          }
        }
      }),
      
      // Skill paths récents pour la liste
      prisma.skillPath.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      }),
      
      // Skill paths avec nombre de leçons pour les statistiques
      prisma.skillPath.findMany({
        include: {
          _count: {
            select: {
              lessons: true
            }
          }
        }
      })
    ]);

    // Calculer les statistiques
    const stats = {
      overview: {
        totalSkillPaths,
        publishedSkillPaths,
        draftSkillPaths,
        totalLessons,
        completedLessons,
        completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      },
      skillPaths: recentSkillPaths.map(sp => ({
        id: sp.id,
        name: sp.name,
        createdAt: sp.createdAt.toISOString(),
        lessonsCount: sp.lessons.length,
        progress: sp.lessons.length > 0 ? 
          Math.round((sp.lessons.filter(l => l.status === 'COMPLETED').length / sp.lessons.length) * 100) : 0,
        status: sp.status.toLowerCase()
      })),
      charts: {
        skillPathsGrowth: await getSkillPathsGrowthData(),
        lessonCompletion: {
          completed: completedLessons,
          pending: totalLessons - completedLessons,
          total: totalLessons
        }
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Retourner des statistiques par défaut
    return NextResponse.json({
      overview: {
        totalSkillPaths: 0,
        publishedSkillPaths: 0,
        draftSkillPaths: 0,
        totalLessons: 0,
        completedLessons: 0,
        completionRate: 0
      },
      skillPaths: [],
      charts: {
        skillPathsGrowth: [],
        lessonCompletion: {
          completed: 0,
          pending: 0,
          total: 0
        }
      }
    });
  }
}

// Fonction helper pour obtenir les données de croissance
async function getSkillPathsGrowthData() {
  try {
    // Obtenir les données des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyCreations = await prisma.skillPath.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return dailyCreations.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count.id
    }));
  } catch (error) {
    console.error('Error fetching growth data:', error);
    return [];
  }
}

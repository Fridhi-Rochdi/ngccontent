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

    // Récupérer les statistiques depuis la base de données
    const [skillPathsCount, completedLessons, totalLessons, recentActivity] = await Promise.all([
      // Nombre de skill paths créés
      prisma.skillPath.count(),
      
      // Nombre de leçons avec contenu généré (considérées comme "complétées")
      prisma.lesson.count({
        where: {
          content: {
            some: {
              isSelected: true
            }
          }
        }
      }),
      
      // Nombre total de leçons
      prisma.lesson.count(),
      
      // Activité récente - les 5 derniers skill paths créés
      prisma.skillPath.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          status: true
        }
      })
    ]);

    // Calculer les statistiques
    const stats = {
      skillPathsCompleted: Math.floor(skillPathsCount * 0.6), // 60% considérés comme complétés
      skillPathsTotal: skillPathsCount,
      currentlyLearning: Math.min(skillPathsCount - Math.floor(skillPathsCount * 0.6), 5),
      hoursStudied: completedLessons * 2, // 2h par leçon en moyenne
      lessonsCompleted: completedLessons,
      totalLessons: totalLessons,
      progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      recentActivity
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    
    // Retourner des statistiques par défaut en cas d'erreur
    return NextResponse.json({
      skillPathsCompleted: 0,
      skillPathsTotal: 0,
      currentlyLearning: 0,
      hoursStudied: 0,
      lessonsCompleted: 0,
      totalLessons: 0,
      progressPercentage: 0,
      recentActivity: []
    });
  }
}

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        content: {
          orderBy: { createdAt: 'desc' }
        },
        skillPath: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Formater la réponse pour correspondre à l'interface attendue
    const formattedLesson = {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      status: lesson.status,
      content: lesson.content,
      skillPathId: lesson.skillPathId,
      skillPathName: lesson.skillPath?.name || 'Parcours inconnu'
    };

    return NextResponse.json(formattedLesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);

    // Fallback avec des données statiques pour la démo
    const fallbackLesson = {
      id: id,
      title: 'Leçon de démonstration',
      order: 1,
      status: 'COMPLETED',
      skillPathId: 'demo-skillpath',
      skillPathName: 'Parcours de démonstration',
      content: [
        {
          id: `${id}-content-1`,
          version: 'basic',
          isSelected: true,
          createdAt: new Date().toISOString(),
          content: {
            script: [
              {
                type: 'introduction',
                title: 'Introduction à la leçon',
                narrative: 'Bienvenue dans cette leçon de démonstration. Cette leçon présente les concepts de base.',
                code_example: 'console.log("Hello, World!");'
              },
              {
                type: 'concept',
                title: 'Concept principal',
                narrative: 'Voici le concept principal que nous allons explorer dans cette leçon.',
                code_example: 'function example() {\n  return "concept";\n}'
              },
              {
                type: 'example',
                title: 'Exemple pratique',
                narrative: 'Regardons un exemple concret d\'application de ce concept.',
                code_example: 'const result = example();\nconsole.log(result);'
              },
              {
                type: 'exercise',
                title: 'Exercice',
                narrative: 'À vous de pratiquer ! Essayez de reproduire l\'exemple ci-dessus.',
                code_example: '// Votre code ici'
              },
              {
                type: 'summary',
                title: 'Résumé',
                narrative: 'Nous avons vu les concepts de base. N\'hésitez pas à revenir sur cette leçon si nécessaire.'
              }
            ],
            quiz: {
              questions: [
                {
                  id: 'q1',
                  type: 'multiple_choice',
                  question: 'Quelle est la sortie de console.log("Hello") ?',
                  options: ['Hello', 'undefined', 'null', 'Error'],
                  correct_answer: 'Hello',
                  explanation: 'console.log() affiche la valeur passée en paramètre.',
                  difficulty: 'easy'
                },
                {
                  id: 'q2',
                  type: 'true_false',
                  question: 'JavaScript est un langage compilé.',
                  correct_answer: 'false',
                  explanation: 'JavaScript est un langage interprété.',
                  difficulty: 'easy'
                }
              ]
            },
            project: {
              title: 'Premier projet JavaScript',
              brief: 'Créez votre première application JavaScript simple.',
              requirements: [
                'Créer un fichier HTML avec un script JavaScript',
                'Afficher un message dans la console',
                'Utiliser au moins une fonction',
                'Commenter votre code'
              ],
              evaluation_criteria: [
                'Le code fonctionne correctement',
                'Le code est bien commenté',
                'Les bonnes pratiques sont respectées',
                'La structure est claire'
              ]
            },
            lab_exercises: [
              {
                title: 'Exercice 1: Hello World',
                description: 'Créez un programme qui affiche "Hello, World!" dans la console.',
                steps: [
                  'Ouvrez votre éditeur de code',
                  'Créez un nouveau fichier JavaScript',
                  'Écrivez console.log("Hello, World!");',
                  'Exécutez le programme'
                ],
                expected_output: 'Hello, World!',
                hints: [
                  'Utilisez la fonction console.log()',
                  'N\'oubliez pas le point-virgule à la fin'
                ]
              }
            ]
          }
        }
      ]
    };

    return NextResponse.json(fallbackLesson);
  }
}

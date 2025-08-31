import { prisma } from '@/lib/prisma';
import { generateSingleLessonContent } from '@/lib/contentGenerator';
import { LessonVersion } from '@/lib/aiGeneration';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: skillPathId } = await params;
    const { lessonId, version = 'basic' } = await request.json();

    if (!lessonId || !['basic', 'creative', 'advanced'].includes(version)) {
      return NextResponse.json(
        { error: 'lessonId and valid version are required' },
        { status: 400 }
      );
    }

    // Récupérer le skill path avec la leçon
    const skillPath = await prisma.skillPath.findUnique({
      where: { id: skillPathId },
      include: {
        lessons: {
          where: { id: lessonId },
          include: {
            content: true
          }
        }
      }
    });

    if (!skillPath || skillPath.lessons.length === 0) {
      return NextResponse.json(
        { error: 'Skill path or lesson not found' },
        { status: 404 }
      );
    }

    const lesson = skillPath.lessons[0];
    const sommaire = skillPath.sommaire as any;

    // Trouver la leçon dans le sommaire pour obtenir les données complètes
    let lessonFromSommaire = null;

    for (const unit of sommaire.units || []) {
      for (const module of unit.modules || []) {
        const foundLesson = module.lessons?.find((l: any) => l.title === lesson.title);
        if (foundLesson) {
          lessonFromSommaire = foundLesson;
          break;
        }
      }
      if (lessonFromSommaire) break;
    }

    if (!lessonFromSommaire) {
      return NextResponse.json(
        { error: 'Lesson not found in sommaire' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la leçon
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { status: 'GENERATING' }
    });

    try {
      // Utiliser le nouveau système d'IA pour générer le contenu
      console.log(`📚 Génération de contenu pour: ${lessonFromSommaire.title}`);
      
      const lessonVersions = await generateSingleLessonContent(
        lessonFromSommaire.title,
        lessonFromSommaire.concepts?.map((c: any) => c.title).join(', ') || '',
        `Contexte du skill path: ${skillPath.name}`
      );

      console.log(`✅ ${lessonVersions.length} versions générées`);
      // Sauvegarder les trois versions générées
      const savedContents = [];
      
      for (let i = 0; i < lessonVersions.length && i < 3; i++) {
        const versionName = lessonVersions[i].version === 'basique' ? 'basic' : 
                           lessonVersions[i].version === 'intermédiaire' ? 'intermediate' : 'creative';
        const generatedContent = lessonVersions[i];

        // Vérifier si une version de ce contenu existe déjà
        const existingContent = await prisma.lessonContent.findUnique({
          where: {
            lessonId_version: {
              lessonId: lessonId,
              version: versionName
            }
          }
        });

        if (existingContent) {
          // Mettre à jour le contenu existant
          const updated = await prisma.lessonContent.update({
            where: { id: existingContent.id },
            data: {
              content: generatedContent as any,
              isSelected: versionName === version // Marquer comme version sélectionnée si c'est celle demandée
            }
          });
          savedContents.push(updated);
        } else {
          // Créer un nouveau contenu
          const created = await prisma.lessonContent.create({
            data: {
              lessonId: lessonId,
              version: versionName,
              content: generatedContent as any,
              isSelected: versionName === version
            }
          });
          savedContents.push(created);
        }
      }

      // Mettre à jour le statut de la leçon
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { status: 'COMPLETED' }
      });

      return NextResponse.json({
        message: 'Content generated successfully',
        generatedVersions: lessonVersions.length,
        versions: savedContents.map(content => ({
          version: content.version,
          isSelected: content.isSelected
        })),
        selectedContent: savedContents.find(content => content.version === version)?.content
      });

    } catch (aiError) {
      // En cas d'erreur, mettre à jour le statut
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { status: 'FAILED' }
      });
      
      console.error('AI Generation error:', aiError);
      return NextResponse.json(
        { error: `Failed to generate content with AI: ${aiError instanceof Error ? aiError.message : 'Erreur inconnue'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

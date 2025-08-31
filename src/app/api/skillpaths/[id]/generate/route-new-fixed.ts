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

    console.log(`🚀 Génération de contenu pour la leçon ${lessonId}, version: ${version}`);

    // Récupérer le skill path
    const skillPath = await prisma.skillPath.findUnique({
      where: { id: skillPathId },
      include: { lessons: true }
    });

    if (!skillPath) {
      return NextResponse.json(
        { error: 'Skill path not found' },
        { status: 404 }
      );
    }

    // Récupérer la leçon
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Parser le sommaire pour trouver la leçon
    let sommaire;
    try {
      sommaire = JSON.parse(skillPath.sommaire as string);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid sommaire format' },
        { status: 400 }
      );
    }

    // Trouver la leçon dans le sommaire
    const lessonFromSommaire = sommaire.lessons?.find((l: any) => l.title === lesson.title);
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
        lessonFromSommaire.title
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

      const selectedContent = savedContents.find(content => content.version === version);

      return NextResponse.json({
        message: 'Content generated successfully',
        generatedVersions: lessonVersions.length,
        versions: savedContents.map(content => ({
          version: content.version,
          isSelected: content.isSelected
        })),
        selectedContent: selectedContent?.content,
        lessonTitle: lessonFromSommaire.title
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

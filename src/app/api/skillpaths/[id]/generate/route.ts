import { prisma } from '@/lib/prisma';
import { generateSingleLessonContent } from '@/lib/contentGenerator';
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

    // Trouver les informations de contexte (unité et module)
    let unitName = '';
    let moduleName = '';
    let moduleObjective = '';

    for (const unit of sommaire.units || []) {
      for (const module of unit.modules || []) {
        const foundLesson = module.lessons?.find((l: any) => l.title === lesson.title);
        if (foundLesson) {
          unitName = unit.name;
          moduleName = module.name;
          moduleObjective = module.objective;
          break;
        }
      }
      if (unitName) break;
    }

    // Mettre à jour le statut de la leçon
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { status: 'GENERATING' }
    });

    try {
      // Générer le contenu avec l'IA
      const lessonFromSommaire = sommaire.units
        .flatMap((u: any) => u.modules || [])
        .flatMap((m: any) => m.lessons || [])
        .find((l: any) => l.title === lesson.title);

      if (!lessonFromSommaire) {
        throw new Error('Lesson not found in sommaire');
      }

      const generatedVersions = await generateSingleLessonContent(
        lessonFromSommaire.title || 'Untitled Lesson',
        `Module: ${moduleName}, Unit: ${unitName}, Objective: ${moduleObjective || 'N/A'}`,
        `Skill Path Context: Version ${version}`
      );

      // Sélectionner la version appropriée selon le niveau demandé
      let selectedContent = generatedVersions[0]; // Par défaut, première version
      if (version === 'basic') {
        selectedContent = generatedVersions.find(v => v.version === 'basique') || generatedVersions[0];
      } else if (version === 'intermediate') {
        selectedContent = generatedVersions.find(v => v.version === 'intermédiaire') || generatedVersions[1] || generatedVersions[0];
      } else if (version === 'creative') {
        selectedContent = generatedVersions.find(v => v.version === 'créative') || generatedVersions[2] || generatedVersions[0];
      }

      // Vérifier si une version de ce contenu existe déjà
      const existingContent = await prisma.lessonContent.findUnique({
        where: {
          lessonId_version: {
            lessonId: lessonId,
            version: version
          }
        }
      });

      if (existingContent) {
        // Mettre à jour le contenu existant
        await prisma.lessonContent.update({
          where: { id: existingContent.id },
          data: {
            content: selectedContent as any,
            isSelected: true // Marquer comme version sélectionnée
          }
        });
      } else {
        // Créer un nouveau contenu
        await prisma.lessonContent.create({
          data: {
            lessonId: lessonId,
            version: version,
            content: selectedContent as any,
            isSelected: true
          }
        });
      }

      // Mettre à jour le statut de la leçon
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { status: 'COMPLETED' }
      });

      return NextResponse.json({
        message: 'Content generated successfully',
        content: selectedContent
      });

    } catch (aiError) {
      // En cas d'erreur, mettre à jour le statut
      await prisma.lesson.update({
        where: { id: lessonId },
        data: { status: 'FAILED' }
      });
      
      console.error('AI Generation error:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate content with AI' },
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

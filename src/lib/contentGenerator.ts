import { parseSkillPath } from '@/utils/skillPathParser';
import { generateSkillPathContent, LessonVersion, ContentGenerationRequest } from '@/lib/aiGeneration';

export async function generateSingleLessonContent(
  topicTitle: string,
  topicDescription: string = '',
  context: string = ''
): Promise<LessonVersion[]> {
  const request: ContentGenerationRequest = {
    topic: topicTitle,
    targetAudience: topicDescription || 'Étudiants en programmation',
    prerequisites: context ? [context] : [],
    estimatedDuration: 60
  };
  
  const result = await generateSkillPathContent(request);
  return [result.version1_basique, result.version2_intermediaire, result.version3_creative];
}

export async function generateContentFromSkillPath(skillPathText: string): Promise<any> {
  try {
    // Parser le skill path
    const parsedSkillPath = parseSkillPath(skillPathText);
    
    console.log('Skill path parsé:', JSON.stringify(parsedSkillPath, null, 2));
    
    const generatedLessons = [];
    
    // Pour chaque unité
    for (const unit of parsedSkillPath.units) {
      console.log(`Traitement de l'unité: ${unit.name}`);
      
      // Pour chaque module
      for (const module of unit.modules) {
        console.log(`Traitement du module: ${module.name}`);
        
        // Pour chaque leçon
        for (const lesson of module.lessons) {
          console.log(`Génération de contenu pour la leçon: ${lesson.title}`);
          
          try {
            // Générer le contenu de la leçon
            const lessonVersions = await generateSingleLessonContent(
              lesson.title,
              lesson.concepts?.join(', ') || '',
              `Module: ${module.name}, Unité: ${unit.name}`
            );
            
            generatedLessons.push({
              lesson: lesson,
              versions: lessonVersions,
              module: module.name,
              unit: unit.name
            });
            
          } catch (error) {
            console.error(`Erreur lors de la génération de contenu pour ${lesson.title}:`, error);
            // Continuer avec les autres leçons même en cas d'erreur
            generatedLessons.push({
              lesson: lesson,
              versions: [],
              module: module.name,
              unit: unit.name,
              error: error instanceof Error ? error.message : 'Erreur inconnue'
            });
          }
        }
      }
    }
    
    return {
      skillPath: parsedSkillPath,
      generatedLessons: generatedLessons,
      summary: {
        totalUnits: parsedSkillPath.units.length,
        totalModules: parsedSkillPath.units.reduce((acc, unit) => acc + unit.modules.length, 0),
        totalLessons: generatedLessons.length,
        successfulGenerations: generatedLessons.filter(l => !l.error).length,
        failedGenerations: generatedLessons.filter(l => l.error).length
      }
    };
    
  } catch (error) {
    console.error('Erreur lors du traitement du skill path:', error);
    throw error;
  }
}

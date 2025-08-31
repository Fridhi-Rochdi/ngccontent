import { parseSkillPath } from '@/utils/skillPathParser';
import { generateSkillPathContent, LessonVersion, ContentGenerationRequest } from '@/lib/aiGeneration';

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
          console.log(`Génération du contenu pour la leçon: ${lesson.title}`);
          
          // Préparer la description et le contexte pour l'IA
          const topicDescription = lesson.concepts.map(concept => 
            `- ${concept.title}${concept.videos_scrimba ? ` (vidéo: ${concept.videos_scrimba})` : ''}`
          ).join('\n');
          
          const context = [
            lesson.lab_ngc ? `Lab NGC: ${lesson.lab_ngc}` : '',
            lesson.quiz ? `Quiz: ${lesson.quiz}` : '',
            lesson.project ? `Projet: ${lesson.project}` : ''
          ].filter(Boolean).join('\n');
          
          // Générer le contenu avec l'IA (nouveau système avec interface ContentGenerationRequest)
          const request: ContentGenerationRequest = {
            topic: lesson.title,
            targetAudience: topicDescription || 'Étudiants en programmation',
            prerequisites: context ? [context] : [],
            estimatedDuration: 180 // durée de base, sera ajustée par les 3 versions
          };
          
          const result = await generateSkillPathContent(request);
          const generatedVersions = [result.version1_basique, result.version2_intermediaire, result.version3_creative];
          
          generatedLessons.push({
            unit: unit.name,
            module: module.name,
            lesson: lesson.title,
            generatedContent: generatedVersions
          });
          
          // Pause entre les générations pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    return {
      parsedSkillPath,
      generatedLessons
    };
    
  } catch (error) {
    console.error('Erreur lors de la génération du contenu:', error);
    throw new Error(`Erreur lors de la génération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

export async function generateSingleLessonContent(
  title: string, 
  description: string, 
  context: string = ''
): Promise<LessonVersion[]> {
  try {
    const request: ContentGenerationRequest = {
      topic: title,
      targetAudience: description || 'Étudiants en programmation',
      prerequisites: context ? [context] : [],
      estimatedDuration: 180
    };
    
    const result = await generateSkillPathContent(request);
    return [result.version1_basique, result.version2_intermediaire, result.version3_creative];
  } catch (error) {
    console.error('Erreur lors de la génération d\'une leçon:', error);
    throw new Error(`Erreur lors de la génération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

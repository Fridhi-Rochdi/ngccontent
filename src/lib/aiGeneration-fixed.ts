import { generateObject } from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { z } from 'zod';

// Configuration du modèle Azure OpenAI
const azure = createAzure({
  resourceName: 'nextgen-australia-east',
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
});

// Schéma pour valider le contenu généré
const ScriptStepSchema = z.object({
  type: z.enum(['introduction', 'concept', 'example', 'exercise', 'conclusion']),
  title: z.string(),
  narrative: z.string(),
  code_example: z.string().optional(),
  visual_aids: z.array(z.string()).optional()
});

const LessonContentSchema = z.object({
  script: z.array(ScriptStepSchema)
});

const LessonVersionSchema = z.object({
  title: z.string(),
  duration: z.number(),
  level: z.string(),
  content: LessonContentSchema
});

export interface LessonVersion {
  title: string;
  duration: number; // en minutes
  level: string;
  content: {
    script: {
      type: 'introduction' | 'concept' | 'example' | 'exercise' | 'conclusion';
      title: string;
      narrative: string;
      code_example?: string;
      visual_aids?: string[];
    }[];
  };
}

/**
 * Génère le contenu d'une leçon avec l'IA Azure OpenAI
 */
export async function generateLessonContent(
  topicTitle: string,
  topicDescription: string,
  context: string = ''
): Promise<LessonVersion[]> {
  console.log('🚀 Génération du contenu pour:', topicTitle);

  try {
    // Prompt détaillé pour la génération de trois versions
    const systemPrompt = `Tu es un expert en création de contenu éducatif de style Scrimba. 
Tu crées des cours interactifs engageants qui combinent théorie pratique, exemples concrets et exercices interactifs.
Tu dois générer EXACTEMENT 3 versions d'une même leçon avec des durées et niveaux différents.

STYLE SCRIMBA REQUIS:
- Narration conversationnelle et engageante
- Exemples pratiques avec du vrai code
- Progression logique: intro → concept → exemple → exercice → conclusion
- Ton amical et accessible
- Explications claires avec métaphores si nécessaire

STRUCTURE OBLIGATOIRE pour chaque version:
1. INTRODUCTION: Présentation du sujet, pourquoi c'est important
2. CONCEPT: Explication théorique claire
3. EXEMPLE: Démonstration pratique avec code
4. EXERCICE: Challenge interactif pour l'apprenant
5. CONCLUSION: Récap et next steps

VERSIONS REQUISES:
- BASIC: 180 minutes, niveau "Débutant", concepts essentiels
- INTERMEDIATE: 360 minutes, niveau "Intermédiaire", approfondissement
- CREATIVE: 600 minutes, niveau "Avancé", aspects créatifs et avancés`;

    const userPrompt = `Génère 3 versions complètes d'une leçon sur: "${topicTitle}"

Description: ${topicDescription}
${context ? `Contexte supplémentaire: ${context}` : ''}

IMPORTANT: Réponds avec un tableau JSON contenant exactement 3 objets avec cette structure:
[
  {
    "title": "Version courte du titre",
    "duration": 180,
    "level": "Débutant",
    "content": {
      "script": [
        {
          "type": "introduction",
          "title": "Titre de l'introduction",
          "narrative": "Récit conversationnel style Scrimba...",
          "code_example": "// Code d'exemple si pertinent",
          "visual_aids": ["Description des éléments visuels"]
        },
        {
          "type": "concept",
          "title": "Titre du concept principal",
          "narrative": "Explication approfondie...",
          "code_example": "// Code démonstratif",
          "visual_aids": ["Diagrammes ou schémas suggérés"]
        },
        {
          "type": "example",
          "title": "Exemple pratique",
          "narrative": "Démonstration step-by-step...",
          "code_example": "// Code complet de l'exemple",
          "visual_aids": ["Screenshots ou animations"]
        },
        {
          "type": "exercise",
          "title": "Challenge interactif",
          "narrative": "Instructions pour l'exercice...",
          "code_example": "// Code de départ pour l'exercice",
          "visual_aids": ["Maquettes ou résultats attendus"]
        },
        {
          "type": "conclusion",
          "title": "Récapitulatif",
          "narrative": "Résumé des points clés...",
          "code_example": "// Code final ou snippet récap",
          "visual_aids": ["Résumé visuel des concepts"]
        }
      ]
    }
  },
  {
    "title": "Version intermédiaire du titre",
    "duration": 360,
    "level": "Intermédiaire",
    "content": {
      "script": [
        // Même structure mais contenu plus approfondi
      ]
    }
  },
  {
    "title": "Version avancée du titre",
    "duration": 600,
    "level": "Avancé",
    "content": {
      "script": [
        // Même structure mais contenu créatif et avancé
      ]
    }
  }
]`;

    console.log('📡 Appel à l\'API Azure OpenAI...');

    const result = await generateObject({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.array(LessonVersionSchema),
      maxRetries: 2,
      temperature: 0.7,
    });

    console.log('✅ Contenu généré avec succès');
    const lessonVersions = result.object;

    // Validation finale
    if (!Array.isArray(lessonVersions) || lessonVersions.length !== 3) {
      throw new Error('Le modèle n\'a pas généré exactement 3 versions de la leçon');
    }

    console.log(`📚 ${lessonVersions.length} versions générées:`, 
      lessonVersions.map(v => `${v.level} (${v.duration}min)`).join(', ')
    );

    return Array.isArray(lessonVersions) ? lessonVersions : [lessonVersions];
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    throw new Error(`Impossible de générer le contenu de la leçon: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

export async function generateAllLessonsContent(
  skillPathId: string,
  version: 'basic' | 'creative' | 'advanced' = 'basic'
): Promise<void> {
  // Cette fonction sera implémentée pour générer tout le contenu d'un skill path
  // Elle sera appelée en arrière-plan pour éviter les timeouts
  console.log(`Génération du contenu pour le skill path ${skillPathId} en version ${version}`);
}

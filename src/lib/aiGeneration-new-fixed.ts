import { generateObject } from 'ai';
import { createAzure } from '@ai-sdk/azure';
import { z } from 'zod';

// Configuration du modèle Azure OpenAI
const azure = createAzure({
  baseURL: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
});

// Schémas pour le nouveau format détaillé
const ScriptStepSchema = z.object({
  segment: z.string(),
  narration: z.string(),
  code: z.string().optional(),
  video_reference: z.string()
});

const InteractiveChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  instructions: z.string(),
  starter_code: z.string(),
  solution_code: z.string()
});

const LabNGCSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  starter_code: z.string(),
  solution_code: z.string(),
  steps: z.array(z.string())
});

const QuizSchema = z.object({
  multiple_choice: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correct_answer: z.string()
  })),
  open_ended: z.object({
    question: z.string(),
    sample_answer: z.string()
  })
});

const ProjectSchema = z.object({
  title: z.string(),
  brief: z.string(),
  criteria: z.array(z.string()),
  steps: z.array(z.string()),
  line_by_line_explanation: z.array(z.object({
    line: z.string(),
    explanation: z.string()
  })),
  sample_code: z.string()
});

const LessonContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  objective: z.string(),
  script: z.array(ScriptStepSchema),
  interactive_challenges: z.array(InteractiveChallengeSchema),
  lab_ngc: LabNGCSchema,
  quiz: QuizSchema,
  project: ProjectSchema,
  estimated_duration_minutes: z.number()
});

const LessonVersionSchema = z.object({
  version: z.string(),
  meta: z.object({
    assumptions: z.array(z.string())
  }),
  executive_summary: z.string(),
  lesson: LessonContentSchema
});

// Schéma pour contenir les trois versions
const ThreeVersionsSchema = z.object({
  version1_basique: LessonVersionSchema,
  version2_intermediaire: LessonVersionSchema,
  version3_creative: LessonVersionSchema
});

// Interface pour la compatibilité avec l'ancien code
export interface LessonVersion {
  title: string;
  duration: number;
  level: string;
  content: any;
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
    const lessonData = {
      title: topicTitle,
      description: topicDescription,
      concepts: [
        {
          title: topicTitle,
          videos_scrimba: ["scrimba-intro-1", "scrimba-concept-2"]
        }
      ],
      lab_ngc: `Lab pratique: ${topicTitle}`,
      quiz: `Quiz: ${topicTitle}`,
      project: `Projet: ${topicTitle}`
    };

    const currentDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    // Prompt amélioré fourni par l'utilisateur
    const systemPrompt = `Tu es une IA experte en création de contenu pédagogique interactif, style Scrimba, pour l'apprentissage du développement web. Ton objectif est de générer **trois versions distinctes** d'un JSON conforme au schéma spécifié pour une leçon donnée, basé sur les données fournies dans ${JSON.stringify(lessonData)}. 

Chaque version doit être unique (variations dans le style, la complexité, les scénarios du projet/lab/challenges), couvrir tous les concepts de la leçon, et respecter les durées minimales suivantes :
- Version 1 (Basique) : 3 heures minimum (180 minutes), contenu simple pour débutants absolus.
- Version 2 (Intermédiaire) : 6 heures minimum (360 minutes), contenu enrichi avec exemples complexes.
- Version 3 (Créative) : 10 heures minimum (600 minutes), contenu créatif avec projets thématiques.

Le contenu doit être clair, conversationnel, engageant, et favoriser un apprentissage actif avec des pauses pour des challenges interactifs. Utilise une voix professionnelle, masculine, et motivante, comme un formateur expérimenté.

### Instructions générales :
- **Langue** : Français, ton accessible mais technique, adapté aux débutants.
- **Contexte** : La leçon fait partie d'un parcours pédagogique structuré (skill path). Utilise les concepts, vidéos Scrimba, labs, quiz et projets de ${JSON.stringify(lessonData)}.
- **Validité** : Chaque JSON doit être syntaxiquement correct, avec des chaînes échappées (ex. : \\n pour les sauts de ligne).
- **Date actuelle** : ${currentDate}

### Durée estimée :
- **Version 1** : ≥180 min, contenu simple
- **Version 2** : ≥360 min, contenu enrichi  
- **Version 3** : ≥600 min, contenu créatif

### Trois versions :
- **Version 1 (Basique)** : Style simple, exemples minimalistes, projet/lab accessibles, narrations très détaillées.
- **Version 2 (Intermédiaire)** : Style engageant, exemples riches, projet/lab plus complexes, narrations pratiques.
- **Version 3 (Créative)** : Style dynamique, exemples thématiques, projet/lab avancés, narrations inspirantes.`;

    const userPrompt = `Génère trois versions complètes d'une leçon sur: "${topicTitle}"

Description: ${topicDescription}
${context ? `Contexte supplémentaire: ${context}` : ''}

IMPORTANT: Réponds avec un objet JSON contenant exactement 3 versions avec cette structure:
{
  "version1_basique": {
    "version": "1.0",
    "meta": {
      "assumptions": ["Débutant absolu", "Accès à un éditeur de code", "Connexion internet"]
    },
    "executive_summary": "Résumé de la version basique...",
    "lesson": {
      "id": "lesson-v1-${Date.now()}",
      "title": "Titre de la leçon - Version Basique",
      "objective": "Objectif pédagogique clair",
      "script": [
        {
          "segment": "introduction",
          "narration": "Narration conversationnelle style Scrimba de 3-15 minutes...",
          "code": "// Code d'exemple si pertinent\\nconsole.log('Hello World');",
          "video_reference": "scrimba-intro-1"
        }
      ],
      "interactive_challenges": [
        {
          "id": "challenge-1",
          "title": "Premier défi",
          "instructions": "Instructions claires...",
          "starter_code": "// Code de départ\\n",
          "solution_code": "// Solution complète\\n"
        }
      ],
      "lab_ngc": {
        "title": "Lab pratique - Version Basique",
        "instructions": "Instructions détaillées du lab...",
        "starter_code": "// Code de départ du lab\\n",
        "solution_code": "// Solution complète du lab\\n",
        "steps": ["Étape 1", "Étape 2", "Étape 3"]
      },
      "quiz": {
        "multiple_choice": [
          {
            "question": "Question à choix multiples?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A"
          }
        ],
        "open_ended": {
          "question": "Question ouverte?",
          "sample_answer": "Exemple de réponse"
        }
      },
      "project": {
        "title": "Projet - Version Basique",
        "brief": "Description du projet...",
        "criteria": ["Critère 1", "Critère 2", "Critère 3"],
        "steps": ["Étape 1", "Étape 2", "Étape 3"],
        "line_by_line_explanation": [
          {
            "line": "console.log('Hello');",
            "explanation": "Cette ligne affiche un message"
          }
        ],
        "sample_code": "// Code exemple complet\\nconsole.log('Projet terminé');"
      },
      "estimated_duration_minutes": 180
    }
  },
  "version2_intermediaire": {
    // Structure similaire mais contenu intermédiaire, durée 360 minutes
  },
  "version3_creative": {
    // Structure similaire mais contenu créatif, durée 600 minutes
  }
}`;

    console.log('📡 Appel à l\'API Azure OpenAI...');

    const result = await generateObject({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!),
      system: systemPrompt,
      prompt: userPrompt,
      schema: ThreeVersionsSchema,
      maxRetries: 2,
      temperature: 0.7,
    });

    console.log('✅ Contenu généré avec succès');
    const threeVersions = result.object;

    // Convertir au format attendu par le reste de l'application
    const lessonVersions: LessonVersion[] = [
      {
        title: threeVersions.version1_basique.lesson.title,
        duration: threeVersions.version1_basique.lesson.estimated_duration_minutes,
        level: "Débutant",
        content: threeVersions.version1_basique
      },
      {
        title: threeVersions.version2_intermediaire.lesson.title,
        duration: threeVersions.version2_intermediaire.lesson.estimated_duration_minutes,
        level: "Intermédiaire",
        content: threeVersions.version2_intermediaire
      },
      {
        title: threeVersions.version3_creative.lesson.title,
        duration: threeVersions.version3_creative.lesson.estimated_duration_minutes,
        level: "Avancé",
        content: threeVersions.version3_creative
      }
    ];

    // Validation finale
    if (lessonVersions.length !== 3) {
      throw new Error('Le modèle n\'a pas généré exactement 3 versions de la leçon');
    }

    console.log(`📚 ${lessonVersions.length} versions générées:`, 
      lessonVersions.map(v => `${v.level} (${v.duration}min)`).join(', ')
    );

    return lessonVersions;
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    throw new Error(`Impossible de générer le contenu de la leçon: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

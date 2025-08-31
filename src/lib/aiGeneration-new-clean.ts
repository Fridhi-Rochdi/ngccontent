import { z } from 'zod';

// Schémas pour le nouveau format détaillé basé sur votre exemple exact
const ScriptStepSchema = z.object({
  segment: z.string(),
  narration: z.string(),
  code: z.string().optional(),
  video_reference: z.string()
});

const LabNGCSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  steps: z.array(z.string()),
  starter_code: z.string(),
  solution_code: z.string()
});

const LineExplanationSchema = z.object({
  line: z.string(),
  explanation: z.string()
});

const ProjectSchema = z.object({
  title: z.string(),
  brief: z.string(),
  criteria: z.array(z.string()),
  steps: z.array(z.string()),
  line_by_line_explanation: z.array(LineExplanationSchema),
  sample_code: z.string()
});

const LessonSchema = z.object({
  script: z.array(ScriptStepSchema),
  lab_ngc: LabNGCSchema,
  project: ProjectSchema,
  estimated_duration_minutes: z.number()
});

const LessonVersionSchema = z.object({
  version: z.string(),
  meta: z.object({
    assumptions: z.array(z.string())
  }),
  executive_summary: z.string(),
  lesson: LessonSchema
});

const ThreeVersionsSchema = z.object({
  version1_basique: LessonVersionSchema,
  version2_intermediaire: LessonVersionSchema,
  version3_creative: LessonVersionSchema
});

export interface ContentGenerationRequest {
  topic: string;
  targetAudience: string;
  prerequisites: string[];
  estimatedDuration: number;
}

export interface ContentGenerationResponse {
  version1_basique: LessonVersion;
  version2_intermediaire: LessonVersion;
  version3_creative: LessonVersion;
}

export interface LessonVersion {
  version: string;
  meta: {
    assumptions: string[];
  };
  executive_summary: string;
  lesson: {
    script: ScriptStep[];
    lab_ngc: LabNGC;
    project: Project;
    estimated_duration_minutes: number;
  };
}

export interface ScriptStep {
  segment: string;
  narration: string;
  code?: string;
  video_reference: string;
}

export interface LabNGC {
  title: string;
  instructions: string;
  steps: string[];
  starter_code: string;
  solution_code: string;
}

export interface Project {
  title: string;
  brief: string;
  criteria: string[];
  steps: string[];
  line_by_line_explanation: LineExplanation[];
  sample_code: string;
}

export interface LineExplanation {
  line: string;
  explanation: string;
}

export async function callAzureOpenAI(
  messages: Array<{ role: string; content: string }>,
  maxTokens = 4000,
  temperature = 0.7
): Promise<string> {
  try {
    const response = await fetch('/api/chat/azure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Azure OpenAI API error:', errorData);
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    throw error;
  }
}

export async function generateSkillPathContent({
  topic,
  targetAudience,
  prerequisites,
  estimatedDuration
}: ContentGenerationRequest): Promise<ContentGenerationResponse> {
  const systemPrompt = `Tu es un expert en création de contenu pédagogique. Tu génères du contenu d'apprentissage structuré en JSON au format suivant EXACTEMENT :

{
  "version1_basique": {
    "version": "basique",
    "meta": {
      "assumptions": ["liste d'hypothèses sur le niveau des apprenants"]
    },
    "executive_summary": "résumé exécutif détaillé",
    "lesson": {
      "script": [
        {
          "segment": "nom du segment",
          "narration": "narration complète",
          "code": "code d'exemple (optionnel)",
          "video_reference": "référence vidéo"
        }
      ],
      "lab_ngc": {
        "title": "titre du laboratoire",
        "instructions": "instructions détaillées",
        "steps": ["étape 1", "étape 2"],
        "starter_code": "code de départ",
        "solution_code": "code solution"
      },
      "project": {
        "title": "titre du projet",
        "brief": "description du projet",
        "criteria": ["critère 1", "critère 2"],
        "steps": ["étape 1", "étape 2"],
        "line_by_line_explanation": [
          {
            "line": "ligne de code",
            "explanation": "explication"
          }
        ],
        "sample_code": "code d'exemple complet"
      },
      "estimated_duration_minutes": 60
    }
  },
  "version2_intermediaire": {
    // même structure mais contenu intermédiaire
  },
  "version3_creative": {
    // même structure mais approche créative
  }
}

IMPORTANT : Retourne UNIQUEMENT le JSON valide, sans texte avant ou après. Assure-toi que chaque version a une approche différente (basique/intermédiaire/créative) tout en gardant la même structure.`;

  const userPrompt = `Génère du contenu d'apprentissage pour :
- Sujet : ${topic}
- Public cible : ${targetAudience}
- Prérequis : ${prerequisites.join(', ')}
- Durée estimée : ${estimatedDuration} minutes

Crée 3 versions avec des approches pédagogiques différentes mais la même structure JSON.`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    console.log('Appel à Azure OpenAI avec le prompt...');
    const response = await callAzureOpenAI(messages, 6000, 0.7);
    
    console.log('Réponse brute de l\'IA:', response.substring(0, 500) + '...');

    // Nettoyer la réponse pour extraire le JSON
    let cleanResponse = response.trim();
    
    // Retirer les balises de code si présentes
    if (cleanResponse.startsWith('```json') || cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
    }
    
    // Retirer tout texte avant le premier {
    const firstBrace = cleanResponse.indexOf('{');
    if (firstBrace > 0) {
      cleanResponse = cleanResponse.substring(firstBrace);
    }

    // Retirer tout texte après le dernier }
    const lastBrace = cleanResponse.lastIndexOf('}');
    if (lastBrace < cleanResponse.length - 1) {
      cleanResponse = cleanResponse.substring(0, lastBrace + 1);
    }

    console.log('JSON nettoyé:', cleanResponse.substring(0, 500) + '...');

    // Parser le JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.log('Contenu qui a causé l\'erreur:', cleanResponse);
      throw new Error(`Erreur de parsing JSON: ${parseError}`);
    }

    // Valider avec Zod
    const validated = ThreeVersionsSchema.parse(parsedResponse);
    console.log('Contenu validé avec succès');

    return validated as ContentGenerationResponse;

  } catch (error) {
    console.error('Erreur lors de la génération de contenu:', error);
    
    // Retourner un contenu de fallback en cas d'erreur
    const fallbackContent: ContentGenerationResponse = {
      version1_basique: {
        version: "basique",
        meta: {
          assumptions: [`Niveau débutant en ${topic}`, "Connaissance de base en programmation"]
        },
        executive_summary: `Introduction aux concepts de base de ${topic} avec une approche progressive et accessible.`,
        lesson: {
          script: [
            {
              segment: "Introduction",
              narration: `Bienvenue dans cette leçon sur ${topic}. Nous allons découvrir les concepts fondamentaux ensemble.`,
              code: "// Code d'introduction",
              video_reference: "intro_video.mp4"
            }
          ],
          lab_ngc: {
            title: `Laboratoire ${topic} - Niveau Basique`,
            instructions: `Dans ce laboratoire, vous allez pratiquer les concepts de base de ${topic}.`,
            steps: [
              "Ouvrir l'éditeur de code",
              "Créer un nouveau fichier",
              "Implémenter la solution"
            ],
            starter_code: "// Code de départ",
            solution_code: "// Solution complète"
          },
          project: {
            title: `Projet ${topic}`,
            brief: `Créer une application simple utilisant ${topic}`,
            criteria: [
              "Code fonctionnel",
              "Respect des bonnes pratiques",
              "Documentation claire"
            ],
            steps: [
              "Analyse des besoins",
              "Conception",
              "Implémentation",
              "Tests"
            ],
            line_by_line_explanation: [
              {
                line: "const exemple = 'Hello World';",
                explanation: "Déclaration d'une constante exemple"
              }
            ],
            sample_code: "// Code d'exemple complet"
          },
          estimated_duration_minutes: estimatedDuration
        }
      },
      version2_intermediaire: {
        version: "intermédiaire",
        meta: {
          assumptions: [`Expérience préalable avec ${topic}`, "Connaissance des concepts avancés"]
        },
        executive_summary: `Approfondissement des concepts de ${topic} avec des exemples pratiques et des cas d'usage avancés.`,
        lesson: {
          script: [
            {
              segment: "Concepts Avancés",
              narration: `Explorons maintenant les aspects plus complexes de ${topic}.`,
              code: "// Code avancé",
              video_reference: "advanced_video.mp4"
            }
          ],
          lab_ngc: {
            title: `Laboratoire ${topic} - Niveau Intermédiaire`,
            instructions: `Ce laboratoire explore les fonctionnalités avancées de ${topic}.`,
            steps: [
              "Configuration avancée",
              "Implémentation complexe",
              "Optimisation"
            ],
            starter_code: "// Code de départ avancé",
            solution_code: "// Solution avancée"
          },
          project: {
            title: `Projet Avancé ${topic}`,
            brief: `Développer une application complexe avec ${topic}`,
            criteria: [
              "Architecture solide",
              "Performance optimisée",
              "Sécurité renforcée"
            ],
            steps: [
              "Architecture système",
              "Développement modulaire",
              "Tests unitaires",
              "Déploiement"
            ],
            line_by_line_explanation: [
              {
                line: "const advanced = new AdvancedClass();",
                explanation: "Instanciation d'une classe avancée"
              }
            ],
            sample_code: "// Code d'exemple avancé"
          },
          estimated_duration_minutes: estimatedDuration
        }
      },
      version3_creative: {
        version: "créative",
        meta: {
          assumptions: [`Créativité et innovation avec ${topic}`, "Approche expérimentale"]
        },
        executive_summary: `Exploration créative de ${topic} avec des approches innovantes et des projets originaux.`,
        lesson: {
          script: [
            {
              segment: "Innovation",
              narration: `Découvrons des façons créatives d'utiliser ${topic}.`,
              code: "// Code créatif",
              video_reference: "creative_video.mp4"
            }
          ],
          lab_ngc: {
            title: `Laboratoire ${topic} - Approche Créative`,
            instructions: `Expérimentez avec ${topic} de manière innovante.`,
            steps: [
              "Brainstorming",
              "Prototypage rapide",
              "Itération créative"
            ],
            starter_code: "// Code de départ créatif",
            solution_code: "// Solution créative"
          },
          project: {
            title: `Projet Créatif ${topic}`,
            brief: `Créer quelque chose d'unique avec ${topic}`,
            criteria: [
              "Originalité",
              "Innovation technique",
              "Impact utilisateur"
            ],
            steps: [
              "Idéation",
              "Conception créative",
              "Développement artistique",
              "Présentation"
            ],
            line_by_line_explanation: [
              {
                line: "const creative = generateArt();",
                explanation: "Génération d'un élément créatif"
              }
            ],
            sample_code: "// Code d'exemple créatif"
          },
          estimated_duration_minutes: estimatedDuration
        }
      }
    };

    console.log('Utilisation du contenu de fallback');
    return fallbackContent;
  }
}

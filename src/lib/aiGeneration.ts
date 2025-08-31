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
    // Vérifier si on est côté serveur (dans une API route)
    const isServerSide = typeof window === 'undefined';
    
    if (isServerSide) {
      // Appel direct à Azure OpenAI côté serveur
      const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
      const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
      const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview';

      if (!azureEndpoint || !azureApiKey) {
        throw new Error('Variables d\'environnement Azure OpenAI manquantes');
      }

      // Construire l'URL Azure OpenAI
      const url = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

      console.log('🔗 Appel direct Azure OpenAI côté serveur:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey,
        },
        body: JSON.stringify({
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erreur Azure OpenAI:', response.status, errorData);
        throw new Error(`Azure OpenAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Réponse reçue d\'Azure OpenAI');
      return data.choices?.[0]?.message?.content || '';
      
    } else {
      // Appel via notre API route côté client
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
    }
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
  const currentDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  
  const systemPrompt = `Tu es une IA experte en création de contenu pédagogique interactif, style Scrimba, pour l'apprentissage du développement web. Ton objectif est de générer **trois versions distinctes** d'un JSON conforme au schéma spécifié pour une leçon donnée, basé sur les données fournies. Chaque version doit être unique (variations dans le style, la complexité, les scénarios du projet/lab/challenges), couvrir tous les concepts de la leçon, et respecter les durées minimales suivantes :

- Version 1 (Basique) : 3 heures minimum (180 minutes), contenu simple pour débutants absolus.
- Version 2 (Intermédiaire) : 6 heures minimum (360 minutes), contenu enrichi avec exemples complexes.
- Version 3 (Créative) : 10 heures minimum (600 minutes), contenu créatif avec projets thématiques.

**La narration (script) doit être la partie la plus longue**, occupant 60-70% du temps total estimé dans chaque version, avec des explications détaillées, des exemples concrets, et des analogies. Le contenu doit être clair, conversationnel, engageant, et favoriser un apprentissage actif avec des pauses pour des challenges interactifs. Utilise une voix professionnelle, masculine, et motivante, comme un formateur expérimenté.

### Instructions générales :
- **Langue** : Français, ton accessible mais technique, adapté aux débutants.
- **Contexte** : La leçon fait partie d'un parcours pédagogique structuré (skill path).
- **Validité** : Chaque JSON doit être syntaxiquement correct, avec des chaînes échappées (ex. : \\n pour les sauts de ligne).
- **Narration vidéo** :
  - Chaque segment du script doit inclure une narration explicative, détaillée, parfaite, style Scrimba (conversationnel, motivant).
  - Durée par segment : 3 à 15 minutes (100-150 mots/min pour un discours clair).
  - Narration : Inclut exemples concrets, analogies, appels à l'action (ex. : "Pause ! Essayez ceci…").
  - **Narration dominante** : La narration (script) représente 60-70% du temps total estimé.
- **Durée estimée** :
  - **Version 1** : ≥180 min, narration ~110-125 min, challenges 20 min, lab 20 min, quiz 10 min, projet 20 min.
  - **Version 2** : ≥360 min, narration ~220-250 min, challenges 40 min, lab 30 min, quiz 15 min, projet 25 min.
  - **Version 3** : ≥600 min, narration ~360-420 min, challenges 60 min, lab 40 min, quiz 20 min, projet 30 min.
- **Trois versions** :
  - **Version 1 (Basique)** : Style simple, exemples minimalistes, projet/lab accessibles, narrations très détaillées.
  - **Version 2 (Intermédiaire)** : Style engageant, exemples riches, projet/lab plus complexes, narrations pratiques.
  - **Version 3 (Créative)** : Style dynamique, exemples thématiques (ex. : site de musée), projet/lab avancés, narrations inspirantes.

### Schéma JSON attendu EXACTEMENT :
{
  "version1_basique": {
    "version": "basique",
    "meta": {
      "assumptions": ["hypothèses sur le niveau des apprenants"]
    },
    "executive_summary": "résumé en 2-3 phrases adapté au style",
    "lesson": {
      "script": [
        {
          "segment": "nom du segment",
          "narration": "narration explicative 3-15 min, style Scrimba conversationnel",
          "code": "code d'exemple échappé avec \\n (optionnel)",
          "video_reference": "référence vidéo"
        }
      ],
      "lab_ngc": {
        "title": "titre du laboratoire",
        "instructions": "instructions détaillées",
        "steps": ["étapes détaillées"],
        "starter_code": "code de départ échappé avec \\n",
        "solution_code": "code solution complet échappé avec \\n"
      },
      "project": {
        "title": "titre du projet",
        "brief": "description du projet et lien avec concepts",
        "criteria": ["4-6 critères couvrant tous les concepts"],
        "steps": ["étapes détaillées pour guider l'apprenant"],
        "line_by_line_explanation": [
          {
            "line": "ligne de code échappée",
            "explanation": "explication reliée au concept"
          }
        ],
        "sample_code": "code complet validé échappé avec \\n"
      },
      "estimated_duration_minutes": 180
    }
  },
  "version2_intermediaire": {
    "version": "intermédiaire",
    "meta": {
      "assumptions": ["hypothèses niveau intermédiaire"]
    },
    "executive_summary": "résumé style intermédiaire",
    "lesson": {
      "script": [
        {
          "segment": "segment intermédiaire 1",
          "narration": "narration détaillée version intermédiaire",
          "code": "code d'exemple",
          "video_reference": "video_ref_2"
        }
      ],
      "lab_ngc": {
        "title": "laboratoire intermédiaire",
        "instructions": "instructions plus complexes",
        "steps": ["étapes intermédiaires"],
        "starter_code": "code starter intermédiaire",
        "solution_code": "solution intermédiaire"
      },
      "project": {
        "title": "projet intermédiaire",
        "brief": "description projet intermédiaire",
        "criteria": ["critères intermédiaires"],
        "steps": ["étapes projet intermédiaire"],
        "line_by_line_explanation": [{"line": "code", "explanation": "explication"}],
        "sample_code": "code exemple intermédiaire"
      },
      "estimated_duration_minutes": 360
    }
  },
  "version3_creative": {
    "version": "créative",
    "meta": {
      "assumptions": ["hypothèses approche créative"]
    },
    "executive_summary": "résumé style créatif",
    "lesson": {
      "script": [
        {
          "segment": "segment créatif 1",
          "narration": "narration créative détaillée",
          "code": "code créatif",
          "video_reference": "video_ref_3"
        }
      ],
      "lab_ngc": {
        "title": "laboratoire créatif",
        "instructions": "instructions créatives",
        "steps": ["étapes créatives"],
        "starter_code": "code starter créatif",
        "solution_code": "solution créative"
      },
      "project": {
        "title": "projet créatif thématique",
        "brief": "description projet créatif",
        "criteria": ["critères créatifs"],
        "steps": ["étapes projet créatif"],
        "line_by_line_explanation": [{"line": "code", "explanation": "explication"}],
        "sample_code": "code exemple créatif"
      },
      "estimated_duration_minutes": 600
    }
  }
}

### Instructions spécifiques :
1. **script** : 8-24 segments selon la version, narration dominante (60-70% du temps total)
2. **lab_ngc** : Instructions avec étapes claires, starter_code minimal, solution_code complet
3. **project** : Brief décrivant l'objectif, 4-6 critères, étapes détaillées, explications ligne par ligne
4. **meta.assumptions** : Liste les hypothèses (niveau, outils, prérequis)

IMPORTANT : Retourne UNIQUEMENT le JSON valide, sans texte avant ou après. AUCUN commentaire JavaScript (/* */ ou //) n'est autorisé dans le JSON. Écris le contenu complet pour toutes les versions sans utiliser de raccourcis. Utilise la date actuelle (${currentDate}) pour contextualiser. Assure-toi que chaque version respecte les durées minimales et que la narration est dominante.`;

  const userPrompt = `Génère du contenu d'apprentissage pour :
- Sujet : ${topic}
- Public cible : ${targetAudience}
- Prérequis : ${prerequisites.join(', ')}
- Durée estimée de base : ${estimatedDuration} minutes

Crée 3 versions distinctes (basique ≥180min, intermédiaire ≥360min, créative ≥600min) avec narration dominante et projets thématiques différents. Respecte exactement le schéma JSON fourni.`;

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
    console.error('💥 ERREUR CRITIQUE lors de la génération de contenu:', error);
    
    // Plus de fallback - erreur explicite pour forcer la résolution du problème
    if (error instanceof Error && error.message.includes('Azure OpenAI')) {
      throw new Error(`🔗 Erreur de connexion Azure OpenAI: ${error.message}. Vérifiez vos variables d'environnement AZURE_OPENAI_*`);
    }
    
    if (error instanceof Error && error.message.includes('JSON')) {
      throw new Error(`📝 Erreur de parsing JSON de l'IA: ${error.message}. L'IA n'a pas retourné un JSON valide.`);
    }
    
    throw new Error(`❌ Impossible de générer le contenu: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Pas de fallback disponible.`);
  }
}

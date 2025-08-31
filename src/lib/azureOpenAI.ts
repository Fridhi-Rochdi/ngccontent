import { z } from 'zod';

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
export const ThreeVersionsSchema = z.object({
  version1_basique: LessonVersionSchema,
  version2_intermediaire: LessonVersionSchema,
  version3_creative: LessonVersionSchema
});

export type ThreeVersionsType = z.infer<typeof ThreeVersionsSchema>;

/**
 * Appel direct à l'API Azure OpenAI
 */
export async function callAzureOpenAI(
  topicTitle: string,
  topicDescription: string,
  skillPathName: string
): Promise<ThreeVersionsType> {
  
  const systemPrompt = `Tu es un expert en création de contenu éducatif interactif de haute qualité, spécialisé dans la création de leçons format Scrimba pour des développeurs. Tu vas créer du contenu pour la plateforme Next Generation Coding (NGC).

CONTEXTE IMPORTANT :
- Plateforme : Next Generation Coding (NGC)
- Format : Leçons interactives style Scrimba
- Public cible : Développeurs en formation
- Objectif : Créer un contenu engageant, pratique et professionnel

INSTRUCTIONS DE GÉNÉRATION :
Tu dois créer EXACTEMENT 3 versions différentes de la même leçon :

1. VERSION 1 - BASIQUE (version1_basique) :
   - Approche traditionnelle et structurée
   - Explications pas à pas claires
   - Exemples simples et progressifs
   - Parfait pour les débutants

2. VERSION 2 - INTERMÉDIAIRE (version2_intermediaire) :
   - Approche plus technique avec concepts avancés
   - Intégration de bonnes pratiques
   - Cas d'usage réels et pratiques
   - Optimisé pour les développeurs avec expérience

3. VERSION 3 - CRÉATIVE (version3_creative) :
   - Approche innovante et engageante
   - Métaphores créatives et storytelling
   - Défis interactifs avancés
   - Projets créatifs et originaux

STRUCTURE OBLIGATOIRE pour chaque version :

**META INFORMATIONS :**
- assumptions : Liste des prérequis techniques et connaissances assumées
- executive_summary : Résumé exécutif de 2-3 phrases sur l'approche de cette version

**CONTENU DE LA LEÇON :**

1. **SCRIPT DÉTAILLÉ** (minimum 8 segments) :
   - segment : Titre du segment (ex: "Introduction aux concepts")
   - narration : Texte de narration détaillé (200-400 mots)
   - code : Code à présenter (si applicable)
   - video_reference : Description de ce qui se passe à l'écran

2. **CHALLENGES INTERACTIFS** (minimum 3) :
   - id : Identifiant unique
   - title : Titre du challenge
   - instructions : Instructions claires pour l'apprenant
   - starter_code : Code de départ
   - solution_code : Solution complète

3. **LAB NGC** (Laboratoire pratique) :
   - title : Nom du laboratoire
   - instructions : Instructions détaillées
   - starter_code : Code de base
   - solution_code : Solution finale
   - steps : Étapes détaillées (minimum 5)

4. **QUIZ COMPLET** :
   - multiple_choice : 3 questions à choix multiples avec 4 options chacune
   - open_ended : 1 question ouverte avec exemple de réponse

5. **PROJET FINAL** :
   - title : Nom du projet
   - brief : Description du projet (100-200 mots)
   - criteria : Critères d'évaluation (minimum 5)
   - steps : Étapes de réalisation (minimum 8)
   - line_by_line_explanation : Explication ligne par ligne du code final (minimum 10 lignes)
   - sample_code : Code complet du projet

**QUALITÉ REQUISE :**
- Contenu technique précis et à jour
- Exemples de code fonctionnels
- Narration engageante et professionnelle
- Défis progressifs et adaptés au niveau
- Projets pratiques et applicables

**DURÉE ESTIMÉE :**
- Version basique : 45-60 minutes
- Version intermédiaire : 60-90 minutes  
- Version créative : 90-120 minutes`;

  const userPrompt = `Crée une leçon complète sur le sujet : "${topicTitle}"

Description du sujet : ${topicDescription}

Contexte du parcours : ${skillPathName}

Génère les 3 versions demandées avec tout le contenu détaillé selon la structure spécifiée.`;

  const endpoint = `${process.env.AZURE_OPENAI_ENDPOINT!}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME!}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION!}`;

  console.log('📡 Appel direct à l\'API Azure OpenAI...');
  console.log('🔗 URL:', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_API_KEY!,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: {
          type: 'json_object'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', response.status, errorText);
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Réponse reçue de l\'API');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Format de réponse invalide de l\'API');
    }

    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Validation avec Zod
    const result = ThreeVersionsSchema.parse(parsedContent);
    
    console.log('🎉 Contenu généré et validé avec succès!');
    return result;

  } catch (error) {
    console.error('💥 Erreur lors de l\'appel API:', error);
    throw error;
  }
}

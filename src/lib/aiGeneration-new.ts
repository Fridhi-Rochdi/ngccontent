import { generateText } from 'ai';
import { azure } from '@ai-sdk/azure';

// Configuration Azure OpenAI
const azureModel = azure(process.env.AZURE_OPENAI_DEPLOYMENT_NAME!);

export interface LessonData {
  title: string;
  concepts: {
    title: string;
    videos_scrimba: string[];
  }[];
  lab_ngc: string;
  quiz: string;
  project: string;
}

export async function generateLessonContent(
  lessonData: LessonData,
  version: 'basic' | 'intermediate' | 'creative'
): Promise<any[]> {
  
  const currentDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  
  const prompt = `Tu es une IA experte en création de contenu pédagogique interactif, style Scrimba, pour l'apprentissage du développement web. Ton objectif est de générer **trois versions distinctes** d'un JSON conforme au schéma spécifié pour une leçon donnée, basé sur les données fournies dans ${JSON.stringify(lessonData)}. Chaque version doit être unique (variations dans le style, la complexité, les scénarios du projet/lab/challenges), couvrir tous les concepts de la leçon, et respecter les durées minimales suivantes :
- Version 1 (Basique) : 3 heures minimum (180 minutes), contenu simple pour débutants absolus.
- Version 2 (Intermédiaire) : 6 heures minimum (360 minutes), contenu enrichi avec exemples complexes.
- Version 3 (Créative) : 10 heures minimum (600 minutes), contenu créatif avec projets thématiques.
Le contenu doit être clair, conversationnel, engageant, et favoriser un apprentissage actif avec des pauses pour des challenges interactifs. Utilise une voix professionnelle, masculine, et motivante, comme un formateur expérimenté. Voici les instructions détaillées :

### Instructions générales :
- **Langue** : Français, ton accessible mais technique, adapté aux débutants.
- **Contexte** : La leçon fait partie d'un parcours pédagogique structuré (skill path). Utilise les concepts, vidéos Scrimba, labs, quiz et projets de ${JSON.stringify(lessonData)}.
- **Validité** : Chaque JSON doit être syntaxiquement correct, avec des chaînes échappées (ex. : \\n pour les sauts de ligne).
- **Références vidéos** : Intègre les vidéos Scrimba de ${JSON.stringify(lessonData.concepts.map(c => c.videos_scrimba))} dans le script.
- **Narration vidéo** :
  - Chaque segment du script doit inclure une narration explicative, détaillée, parfaite, style Scrimba (conversationnel, motivant).
  - Durée par segment : 3 à 15 minutes (100-150 mots/min pour un discours clair).
  - Narration : Inclut exemples concrets, analogies, appels à l'action (ex. : "Pause ! Essayez ceci…").
  - Ajuste le nombre de segments pour contribuer aux durées totales (V1 : 180 min, V2 : 360 min, V3 : 600 min).
- **Durée estimée** :
  - **Version 1** : ≥180 min, contenu simple (ex. : 4 segments × 8 min, 3 challenges × 10 min, lab 30 min, quiz 15 min, projet 25 min).
  - **Version 2** : ≥360 min, contenu enrichi (ex. : 6 segments × 10 min, 4 challenges × 15 min, lab 45 min, quiz 20 min, projet 35 min).
  - **Version 3** : ≥600 min, contenu créatif (ex. : 8 segments × 12 min, 5 challenges × 20 min, lab 60 min, quiz 25 min, projet 50 min).
- **Hypothèses** : Note dans meta.assumptions les suppositions (ex. : niveau, outils, accès à Scrimba/W3C).
- **Trois versions** :
  - **Version 1 (Basique)** : Style simple, exemples minimalistes, projet/lab accessibles, narrations très détaillées.
  - **Version 2 (Intermédiaire)** : Style engageant, exemples riches, projet/lab plus complexes, narrations pratiques.
  - **Version 3 (Créative)** : Style dynamique, exemples thématiques (ex. : site de musée), projet/lab avancés, narrations inspirantes.

### Schéma JSON attendu (pour chaque version) :
{
  "version": "1.0",
  "meta": {
    "assumptions": [string]
  },
  "executive_summary": string,
  "lesson": {
    "id": string,
    "title": string,
    "objective": string,
    "script": [
      {
        "segment": string,
        "narration": string, // 3-15 min, 100-150 mots/min, explicatif
        "code": string (optional), // Échappé, \\n pour sauts de ligne
        "video_reference": string
      }
    ],
    "interactive_challenges": [
      {
        "id": string,
        "title": string,
        "instructions": string,
        "starter_code": string, // Échappé, \\n
        "solution_code": string // Échappé, \\n
      }
    ], // 2-5 challenges, progressifs
    "lab_ngc": {
      "title": string,
      "instructions": string,
      "starter_code": string, // Échappé, \\n
      "solution_code": string, // Échappé, \\n
      "steps": [string] // Étapes détaillées
    },
    "quiz": {
      "multiple_choice": [
        {
          "question": string,
          "options": [string], // 4 options
          "correct_answer": string
        }
      ], // 4-5 QCM
      "open_ended": {
        "question": string,
        "sample_answer": string
      }
    },
    "project": {
      "title": string,
      "brief": string,
      "criteria": [string], // 4-6 critères
      "steps": [string], // Étapes détaillées
      "line_by_line_explanation": [
        {
          "line": string, // Échappé
          "explanation": string // Relie au concept
        }
      ],
      "sample_code": string // Échappé, \\n
    },
    "estimated_duration_minutes": number // ≥180 (V1), ≥360 (V2), ≥600 (V3)
  }
}

### Contraintes supplémentaires :
- **Narration** : 3-15 min par segment, explicative, parfaite, style Scrimba, avec exemples et appels à l'action.
- **Projet et lab_ngc** : Incluent un champ "steps" avec étapes détaillées. Projet est un exemple concret couvrant tous les concepts.
- **Accessibilité** : Met l'accent sur sémantique, accessibilité, validation W3C.
- **JSON valide** : Chaînes échappées (\\n pour sauts de ligne).
- **Interactivité** : Pauses dans le script pour encourager le codage.
- **Consistance** : Conventions uniformes (lang='fr', indentation 2 espaces).
- **Temps réel** : Utilise la date actuelle (${currentDate}) pour contextualiser (ex. : copyright © 2025).
- **Variations** : V1 simple, V2 enrichie, V3 créative, avec projets distincts (ex. : école, association, musée).

### Données d'entrée :
Génération pour : ${JSON.stringify(lessonData)}.
Version : ${version}.

### Résultat attendu :
Un tableau de trois JSONs ([JSON1, JSON2, JSON3]), chacun respectant le schéma, pour la leçon dans ${JSON.stringify(lessonData)}. Chaque version couvre tous les concepts, avec un projet et un lab détaillés incluant des étapes claires et des explications ligne par ligne. Narrations de 3-15 min par segment. Durées : ≥180 min (V1), ≥360 min (V2), ≥600 min (V3).

Retourne uniquement le tableau JSON sans texte additionnel.`;

  try {
    const result = await generateText({
      model: azureModel,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    // Nettoyer et parser la réponse
    let content = result.text;
    content = content.replace(/```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    // Parser le JSON
    const lessonVersions = JSON.parse(content);
    
    return Array.isArray(lessonVersions) ? lessonVersions : [lessonVersions];
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    throw new Error(`Impossible de générer le contenu de la leçon: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

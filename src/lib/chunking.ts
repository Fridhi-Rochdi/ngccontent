import { LessonContent } from '@/types/skillPath';

interface Chunk {
  text: string;
  source: string; // 'script', 'quiz', 'project', etc.
}

export function chunkLessonContent(content: LessonContent): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Pour le script
  content.script?.forEach((segment) => {
    chunks.push({ 
      text: `${segment.title}: ${segment.narrative}`, 
      source: 'script' 
    });
    
    if (segment.code_example) {
      chunks.push({ 
        text: `Code Example: ${segment.code_example}`, 
        source: 'code' 
      });
    }
  });
  
  // Pour le quiz
  content.quiz?.questions?.forEach((question) => {
    chunks.push({ 
      text: `Question: ${question.question}\nExplanation: ${question.explanation}`, 
      source: 'quiz' 
    });
  });
  
  // Pour le projet
  if (content.project?.brief) {
    chunks.push({ 
      text: `Project: ${content.project.title}\n${content.project.brief}`, 
      source: 'project' 
    });
  }
  
  // Pour les exercices de lab
  content.lab_exercises?.forEach((exercise) => {
    chunks.push({ 
      text: `Lab Exercise: ${exercise.title}\n${exercise.description}`, 
      source: 'lab' 
    });
  });
  
  return chunks;
}

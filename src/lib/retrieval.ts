import { prisma } from '@/lib/prisma';
import { getEmbeddings } from '@/lib/embedding';
import pgvector from 'pgvector/utils';

export async function retrieveContext(
  query: string,
  version: string,
  skillPathId: string,
  currentLessonOrder: number
): Promise<string[]> {
  try {
    const [queryEmbedding] = await getEmbeddings([query]);
    
    const results: any[] = await prisma.$queryRaw`
      SELECT ce.chunk
      FROM "ContentEmbedding" AS ce
      JOIN "Lesson" AS l ON ce."lessonId" = l.id
      WHERE l."skillPathId" = ${skillPathId}
        AND l.order < ${currentLessonOrder}
        AND ce.version = ${version}
      ORDER BY ce.embedding <=> ${pgvector.toSql(queryEmbedding)}
      LIMIT 5
    `;

    return results.map(r => r.chunk);
  } catch (error) {
    console.error('Error retrieving context:', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

export function createSearchQuery(lessonData: any): string {
  const title = lessonData.title || '';
  const concepts = lessonData.concepts?.map((c: any) => c.title || c.name).join(', ') || '';
  return `Contenu pédagogique pour la leçon "${title}" qui couvre les concepts suivants : ${concepts}.`;
}

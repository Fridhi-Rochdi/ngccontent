import { prisma } from '@/lib/prisma';
import { chunkLessonContent } from '@/lib/chunking';
import { getEmbeddings } from '@/lib/embedding';
import { LessonContent } from '@/types/skillPath';
import pgvector from 'pgvector/utils';

export async function indexLessonContent(
  lessonId: string,
  version: string,
  content: LessonContent
): Promise<void> {
  try {
    const chunks = chunkLessonContent(content);
    
    if (chunks.length === 0) {
      console.warn('No chunks to index for lesson:', lessonId);
      return;
    }
    
    const texts = chunks.map(c => c.text);
    const embeddings = await getEmbeddings(texts);

    const dataToIndex = chunks.map((chunk, i) => ({
      lessonId,
      version,
      chunk: chunk.text,
      source: chunk.source,
      embedding: pgvector.toSql(embeddings[i]),
    }));

    // Utiliser une transaction pour l'efficacité
    await prisma.contentEmbedding.createMany({
      data: dataToIndex,
    });

    console.log(`Successfully indexed ${chunks.length} chunks for lesson ${lessonId}`);
  } catch (error) {
    console.error('Error indexing lesson content:', error);
    throw new Error('Failed to index lesson content');
  }
}

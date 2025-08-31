import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';

// Configuration du modèle Azure OpenAI
const embeddingModel = openai.embedding('text-embedding-3-small');

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: texts,
    });
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}

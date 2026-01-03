import { QdrantClient } from '@qdrant/qdrant-js';

// Mock Qdrant connection - replaced by actual env config in production
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });

// Mock embedding generation - replace with actual embedding model
async function generateEmbedding(text: string): Promise<number[]> {
    // This should call an embedding provider like OpenAI
    return new Array(1536).fill(0);
}

export async function searchKnowledgeBase(query: string) {
    const embedding = await generateEmbedding(query);

    // Ensure collection exists or handle error
    const results = await qdrant.search('hotel_knowledge', {
        vector: embedding,
        limit: 5,
        score_threshold: 0.7
    });

    return results.map(r => r.payload?.content);
}

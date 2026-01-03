import { QdrantClient } from '@qdrant/qdrant-js';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

export { qdrant };

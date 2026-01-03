import { QdrantClient } from '@qdrant/qdrant-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

async function main() {
    console.log('Seeding Qdrant...');

    // Create collection if it doesn't exist
    const collectionName = 'hotel_knowledge';
    try {
        await qdrant.createCollection(collectionName, {
            vectors: {
                size: 1536, // OpenAI embedding size
                distance: 'Cosine'
            }
        });
        console.log(`Collection ${collectionName} created.`);
    } catch (e: any) {
        if (e?.status === 409) {
            console.log(`Collection ${collectionName} already exists.`);
        } else {
            console.error('Error creating collection:', e);
        }
    }

    // Add sample docs here...
}

main().catch(console.error);

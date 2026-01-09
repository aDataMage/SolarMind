/**
 * Script to inspect Qdrant collection info
 */
import { QdrantClient } from '@qdrant/qdrant-js';
import 'dotenv/config';

const COLLECTION_NAME = 'solar_knowledge';

async function inspect() {
    const qdrant = new QdrantClient({
        url: process.env.QDRANT_URL!,
        apiKey: process.env.QDRANT_API_KEY,
    });

    try {
        const info = await qdrant.getCollection(COLLECTION_NAME);
        console.log('--- PAYLOAD SCHEMA ---');
        const schema = info.payload_schema || {};
        console.log(JSON.stringify(schema, null, 2));

        console.log('\n--- HAS CATEGORY INDEX? ---');
        console.log(!!schema['category']);

    } catch (error) {
        console.error('Error getting info:', error);
    }
}

inspect();

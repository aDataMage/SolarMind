/**
 * Script to create required Qdrant indexes
 * 
 * Run with: npx tsx scripts/create-qdrant-index.ts
 */
import { QdrantClient } from '@qdrant/qdrant-js';
import 'dotenv/config';

const COLLECTION_NAME = 'solar_knowledge';

async function createIndexes() {
    const qdrant = new QdrantClient({
        url: process.env.QDRANT_URL!,
        apiKey: process.env.QDRANT_API_KEY,
    });

    console.log('🔧 Creating Qdrant indexes...');
    console.log(`   Collection: ${COLLECTION_NAME}`);
    console.log(`   URL: ${process.env.QDRANT_URL}`);

    try {
        // Check if collection exists
        const collections = await qdrant.getCollections();
        const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

        if (!exists) {
            console.log('❌ Collection does not exist. Creating it first...');
            await qdrant.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 1536, // text-embedding-3-small dimensions
                    distance: 'Cosine',
                },
            });
            console.log('✅ Collection created');
        }

        // Create payload index for 'category' field
        console.log('📇 Creating index for "category" field...');
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'category',
            field_schema: 'keyword',
        });
        console.log('✅ Category index created');

        // Create payload index for 'source' field (optional but useful)
        console.log('📇 Creating index for "source" field...');
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'source',
            field_schema: 'keyword',
        });
        console.log('✅ Source index created');

        console.log('\n🎉 All indexes created successfully!');

    } catch (error: any) {
        if (error.data?.status?.error?.includes('already exists')) {
            console.log('ℹ️  Index already exists, skipping...');
        } else {
            console.error('❌ Error:', error.message || error);
            if (error.data) {
                console.error('   Details:', JSON.stringify(error.data, null, 2));
            }
            process.exit(1);
        }
    }
}

createIndexes();

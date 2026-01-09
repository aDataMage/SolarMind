/**
 * Script to FORCE recreate Qdrant indexes
 * 
 * Run with: npx tsx scripts/recreate-index.ts
 */
import { QdrantClient } from '@qdrant/qdrant-js';
import 'dotenv/config';

const COLLECTION_NAME = 'solar_knowledge';

async function recreate() {
    const qdrant = new QdrantClient({
        url: process.env.QDRANT_URL!,
        apiKey: process.env.QDRANT_API_KEY,
    });

    console.log(`🔧 Force recreating indexes for: ${COLLECTION_NAME}`);

    try {
        // Delete existing indexes
        console.log('🗑️  Deleting existing indexes...');
        try {
            await qdrant.deletePayloadIndex(COLLECTION_NAME, 'category');
            console.log('   Deleted "category" index');
        } catch (e) { console.log('   "category" index not found or deletable'); }

        try {
            await qdrant.deletePayloadIndex(COLLECTION_NAME, 'source');
            console.log('   Deleted "source" index');
        } catch (e) { console.log('   "source" index not found or deletable'); }

        // Wait a moment
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create fresh indexes
        console.log('📇 Creating "category" index (keyword)...');
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'category',
            field_schema: 'keyword',
        });

        console.log('📇 Creating "source" index (keyword)...');
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'source',
            field_schema: 'keyword',
        });

        console.log('✅ Indexes recreated successfully!');

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    }
}

recreate();

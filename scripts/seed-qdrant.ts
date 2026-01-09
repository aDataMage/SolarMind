import { QdrantClient } from '@qdrant/qdrant-js';
import dotenv from 'dotenv';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.kiro/.env.local' });

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

const SOLAR_KNOWLEDGE_COLLECTION = 'solar_knowledge';

const DOCUMENTS = [
    // --- Locations ---
    {
        content: "Our Ikeja Showroom is located at 123 Allen Avenue, Ikeja, Lagos. Open Monday-Saturday 8am-6pm. Contact: 0800-SOLAR-LAG.",
        source: "locations_list",
        category: "location",
        metadata: { location: "Lagos", title: "Ikeja Showroom" }
    },
    {
        content: "Our Abuja Experience Center is at Plot 456, Wuse 2, Abuja. Open Monday-Friday 9am-5pm. Experience our full range of inverters and batteries.",
        source: "locations_list",
        category: "location",
        metadata: { location: "Abuja", title: "Abuja Experience Center" }
    },
    {
        content: "Port Harcourt Branch: 789 ABA Road, Port Harcourt. Open Mon-Sat 8am-5pm. Solar repairs and consultations available.",
        source: "locations_list",
        category: "location",
        metadata: { location: "Port Harcourt", title: "Port Harcourt Branch" }
    },

    // --- Policies ---
    {
        content: "Warranty Policy: Solar panels come with a 25-year performance warranty. Inverters have a 2-year manufacturer warranty. Batteries have a 1-5 year warranty depending on the type (Lead-acid: 1 year, Lithium: 5 years).",
        source: "policy_doc_v1",
        category: "policy",
        metadata: { title: "Warranty Policy" }
    },
    {
        content: "Return Policy: Products can be returned within 7 days of purchase if unopened and in original packaging. A 10% restocking fee applies. Defective items are replaced immediately within warranty period.",
        source: "policy_doc_v1",
        category: "policy",
        metadata: { title: "Return & Refund Policy" }
    },
    {
        content: "Installation Policy: We offer professional installation for all systems. Installation costs are calculated based on location and system size. We do not support third-party installations for warranty claims.",
        source: "policy_doc_v1",
        category: "policy",
        metadata: { title: "Installation Policy" }
    },

    // --- FAQs ---
    {
        content: "How do I determine what size inverter I need? Calculate the total wattage of all appliances you want to run simultaneously. The inverter capability (kVA) should exceed this total wattage by at least 20% for safety.",
        source: "faq_db",
        category: "faq",
        metadata: { title: "Inverter Sizing FAQ" }
    },
    {
        content: "Do you offer payment plans? Yes, we partner with specialized banks to offer installment payment plans for complete solar home systems. Down payment of 30% required.",
        source: "faq_db",
        category: "faq",
        metadata: { title: "Payment Plans FAQ" }
    },
    {
        content: "What is the difference between Mono and Poly panels? Monocrystalline panels are more efficient and space-saving but slightly more expensive. Polycrystalline are cheaper but require more roof space.",
        source: "faq_db",
        category: "faq",
        metadata: { title: "Panel Types FAQ" }
    }
];

async function generateEmbedding(text: string) {
    try {
        const { embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: text,
        });
        return embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}

async function main() {
    console.log(`Seeding Qdrant collection: ${SOLAR_KNOWLEDGE_COLLECTION}...`);

    try {
        // Check if collection exists
        const collections = await qdrant.getCollections();
        const exists = collections.collections.some(c => c.name === SOLAR_KNOWLEDGE_COLLECTION);

        if (!exists) {
            await qdrant.createCollection(SOLAR_KNOWLEDGE_COLLECTION, {
                vectors: {
                    size: 1536,
                    distance: 'Cosine'
                }
            });
            console.log(`Collection ${SOLAR_KNOWLEDGE_COLLECTION} created.`);
        } else {
            console.log(`Collection ${SOLAR_KNOWLEDGE_COLLECTION} already exists.`);
        }

        console.log(`Processing ${DOCUMENTS.length} documents...`);

        const points = [];
        for (let i = 0; i < DOCUMENTS.length; i++) {
            const doc = DOCUMENTS[i];
            console.log(`Embedding doc ${i + 1}/${DOCUMENTS.length}: ${doc.metadata.title}`);

            const vector = await generateEmbedding(doc.content);

            points.push({
                id: i + 1,
                vector,
                payload: {
                    content: doc.content,
                    source: doc.source,
                    category: doc.category,
                    lastUpdated: new Date().toISOString(),
                    title: doc.metadata.title,
                    location: doc.metadata.location
                }
            });
        }

        // Batch upsert
        await qdrant.upsert(SOLAR_KNOWLEDGE_COLLECTION, {
            points
        });

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
}

main().catch(console.error);

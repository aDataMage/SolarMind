/**
 * Seed Solar Knowledge Base
 * 
 * Run with: npx tsx scripts/seed-knowledge.ts
 */
import { QdrantClient } from '@qdrant/qdrant-js';
import OpenAI from 'openai';
import * as crypto from 'crypto';

// Load env
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const COLLECTION_NAME = 'solar_knowledge';
const EMBEDDING_MODEL = 'text-embedding-3-small';

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Sample knowledge base for a solar company
const KNOWLEDGE_BASE = [
    // LOCATIONS
    {
        title: "Lagos Main Office",
        content: "Our Lagos main office is located at 45 Solar Avenue, Victoria Island, Lagos. We are open Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM. Phone: +234 800 SOLAR (76527). This is our largest showroom with a full range of inverters, solar panels, and battery systems on display.",
        category: "location"
    },
    {
        title: "Abuja Branch",
        content: "Our Abuja branch is located at 12 Power Street, Wuse 2, Abuja. Opening hours are Monday to Friday 9:00 AM to 5:00 PM, Saturday 10:00 AM to 2:00 PM. Phone: +234 809 123 4567. We offer installation services across the FCT area.",
        category: "location"
    },
    {
        title: "Port Harcourt Office",
        content: "Our Port Harcourt office is at 78 Energy Road, GRA Phase 2, Port Harcourt. Open Monday to Friday 8:30 AM to 5:30 PM. Phone: +234 803 456 7890. We serve the entire Rivers State and surrounding areas.",
        category: "location"
    },

    // POLICIES
    {
        title: "Warranty Policy",
        content: "We offer a comprehensive warranty on all products: Solar Panels come with a 25-year performance warranty guaranteeing at least 80% output. Inverters have a 5-year manufacturer warranty. Lithium batteries have a 10-year warranty. Installation workmanship is covered for 2 years. Warranty claims can be made at any of our branches or by calling our support line.",
        category: "policy"
    },
    {
        title: "Return and Refund Policy",
        content: "Products can be returned within 30 days of purchase if they are in original, unopened packaging. A 10% restocking fee may apply. Installed products cannot be returned. Refunds are processed within 7-14 business days after approval. For custom-ordered items, returns are not accepted unless defective.",
        category: "policy"
    },
    {
        title: "Installation Policy",
        content: "All installations are performed by our certified technicians. Installation is typically completed within 2-5 business days after equipment delivery. A site assessment is required before installation to ensure proper system sizing. Installation costs range from N150,000 to N500,000 depending on system size and complexity.",
        category: "policy"
    },
    {
        title: "Payment Terms",
        content: "We accept bank transfers, POS payments, and cash. A 50% deposit is required to place an order, with the balance due before installation. We offer installment payment plans for purchases over N2,000,000 - up to 12 months with 0% interest through our partner banks.",
        category: "policy"
    },

    // FAQs
    {
        title: "How to Size Your Solar System",
        content: "To determine the right solar system size: 1) List all appliances you want to power when NEPA is off. 2) Note their wattage (found on the appliance label). 3) Estimate hours of daily use. 4) Add 20% buffer for power losses. For example, for a fridge (150W), TV (100W), lights (50W), and fan (75W) running 8 hours, you need minimum 3kWh batteries and a 1.5kVA inverter. Our sales engineers can help with precise calculations.",
        category: "faq"
    },
    {
        title: "Battery Types Explained",
        content: "We offer two main battery types: 1) Lead-Acid batteries are more affordable upfront but last 2-4 years and require maintenance. They need a ventilated space. 2) Lithium-ion batteries (LiFePO4) cost 2-3x more but last 10-15 years, are maintenance-free, more compact, and more efficient. For homes with budget constraints, lead-acid works. For long-term value, lithium is recommended.",
        category: "faq"
    },
    {
        title: "Inverter Capacity Guide",
        content: "Choosing the right inverter: Add up all appliances you want to run simultaneously. A 3.5kVA inverter handles about 2800W of load - suitable for lights, fans, TV, and small fridge. A 5kVA inverter handles up to 4000W - can add an AC unit or freezer. 7.5kVA and above are for larger homes with multiple ACs. Always buy 25% more capacity than calculated for startup surges.",
        category: "faq"
    },
    {
        title: "Solar Panel Maintenance",
        content: "Solar panels require minimal maintenance: Clean panels every 2-4 weeks to remove dust (reduces efficiency by up to 25% if dirty). Use soft cloth and water, no harsh chemicals. Check for bird droppings or debris. Trim nearby trees that may cause shading. Our maintenance team can do quarterly inspections for N25,000 per visit.",
        category: "faq"
    },
    {
        title: "Grid-Tie vs Off-Grid Systems",
        content: "Grid-tie systems connect to NEPA/utility power and can sell excess power back (where net metering is available). They dont work during outages unless you have battery backup. Off-grid systems are completely independent - ideal for areas with poor or no grid connection. Hybrid systems combine both - use grid when available, switch to battery during outages, and can export excess solar.",
        category: "faq"
    },
    {
        title: "Services We Offer",
        content: "Our services include: 1) Free site assessment and solar system sizing consultation. 2) Supply of inverters, batteries, solar panels, and accessories. 3) Professional installation by certified technicians. 4) System maintenance and cleaning. 5) Battery replacement and system upgrades. 6) 24/7 technical support for installed customers. 7) Corporate and industrial solar solutions.",
        category: "faq"
    },
    {
        title: "Popular Product Brands",
        content: "We stock premium brands: Inverters - Luminous, Sukam, Schneider, SMA, Victron. Batteries - Luminous, Genus, Trojan (lead-acid), Felicity, Kodak (lithium). Solar Panels - Canadian Solar, Jinko, JA Solar, Mono PERC efficient panels. All products come with manufacturer warranty and local support.",
        category: "faq"
    },
    {
        title: "Pricing Overview",
        content: "Sample system prices (equipment only): 1.5kVA inverter + 200Ah battery: N350,000-450,000. 3.5kVA inverter + 2x 200Ah batteries: N750,000-1,000,000. 5kVA inverter + 4x 200Ah batteries + 4 panels: N1,800,000-2,500,000. Full home solar (7.5kVA+): N3,000,000-5,000,000. Installation costs are additional. Get a custom quote from our sales team.",
        category: "faq"
    },
    {
        title: "Benefits of Solar Energy",
        content: "Benefits of switching to solar: 1) Cost Savings: Eliminate fuel costs for generators and reduce/eliminate electricity bills. Payback is typically 5-7 years. 2) Reliability: 24/7 power supply independent of the grid capability. 3) Environmental Impact: Clean, renewable energy reduces carbon footprint. 4) Low Maintenance: Modern systems require very little upkeep. 5) Property Value: Solar installation increases property appeal and value.",
        category: "faq"
    }
];

async function generateEmbedding(text: string): Promise<number[]> {
    const result = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
    });
    return result.data[0].embedding;
}

function generateId(): string {
    return crypto.randomUUID();
}

async function seed() {
    console.log(`🌱 Seeding knowledge base: ${COLLECTION_NAME}`);
    console.log(`   URL: ${process.env.QDRANT_URL}`);
    console.log(`   Total entries: ${KNOWLEDGE_BASE.length}`);
    console.log('');

    try {
        // Delete and recreate collection
        console.log('🗑️  Clearing existing collection...');
        try {
            await qdrant.deleteCollection(COLLECTION_NAME);
        } catch (e) {
            // Collection might not exist
        }

        console.log('📦 Creating collection...');
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: { size: 1536, distance: 'Cosine' },
        });

        console.log('📇 Creating category index...');
        await qdrant.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'category',
            field_schema: 'keyword',
        });

        const points = [];

        for (let i = 0; i < KNOWLEDGE_BASE.length; i++) {
            const item = KNOWLEDGE_BASE[i];
            console.log(`   [${i + 1}/${KNOWLEDGE_BASE.length}] Embedding: ${item.title}...`);

            const embedding = await generateEmbedding(item.content);

            points.push({
                id: generateId(),
                vector: embedding,
                payload: {
                    content: item.content,
                    title: item.title,
                    category: item.category,
                    source: 'seed-script',
                    created_at: new Date().toISOString()
                }
            });
        }

        console.log('');
        console.log(`📤 Upserting ${points.length} points to Qdrant...`);
        await qdrant.upsert(COLLECTION_NAME, { points });

        // Verify
        const info = await qdrant.getCollection(COLLECTION_NAME);
        console.log(`✅ Done! Collection now has ${info.points_count} points.`);

    } catch (error: any) {
        console.error('❌ Error seeding:', error.message || error);
        if (error.data) console.error(JSON.stringify(error.data, null, 2));
        process.exit(1);
    }
}

seed();

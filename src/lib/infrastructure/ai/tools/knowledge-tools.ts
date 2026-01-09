/**
 * Knowledge Tools - RAG-based knowledge retrieval
 * 
 * Copied from hotelbot pattern - uses native OpenAI SDK and Qdrant.
 */
import { QdrantClient } from '@qdrant/qdrant-js';
import OpenAI from 'openai';
import { tool } from 'ai';
import { z } from 'zod';

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

const openai = new OpenAI({
  timeout: 60000, // 60 seconds
});

const COLLECTION_NAME = 'solar_knowledge';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

/**
 * Generate embeddings using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Search knowledge base using vector similarity
 */
export async function searchKnowledgeBase(params: {
  query: string;
  category?: 'policy' | 'location' | 'faq' | 'all';
  limit?: number;
}) {
  try {
    const { query, category = 'all', limit = 5 } = params;

    console.log(`🔍 searchKnowledgeBase: query="${query}", category="${category}"`);

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search Qdrant
    const searchParams: any = {
      vector: queryEmbedding,
      limit,
      with_payload: true,
      score_threshold: 0.3,
    };

    // Add category filter if specified
    if (category !== 'all') {
      searchParams.filter = {
        must: [
          {
            key: 'category',
            match: { value: category },
          },
        ],
      };
    }

    const searchResults = await qdrant.search(COLLECTION_NAME, searchParams);

    console.log(`🔍 Qdrant returned ${searchResults.length} results for "${query}"`);
    if (searchResults.length > 0) {
      console.log(`   Top result: ${searchResults[0].payload?.title} (score: ${searchResults[0].score})`);
    }

    if (searchResults.length === 0) {
      return {
        message: 'No relevant information found in our knowledge base',
        suggestion: 'Try rephrasing your question or contact our customer service',
      };
    }

    // Format results
    const results = searchResults.map((result) => ({
      content: result.payload?.content || '',
      title: result.payload?.title || '',
      category: result.payload?.category || '',
      score: result.score,
      metadata: result.payload?.metadata || {},
    }));

    return {
      results,
      count: results.length,
      query,
    };

  } catch (error) {
    console.error('❌ Error searching knowledge base:', error);
    if ((error as any).data) {
      console.error('Qdrant Error Data:', JSON.stringify((error as any).data, null, 2));
    }
    return { error: 'Failed to search knowledge base' };
  }
}

/**
 * Knowledge search tool for AI agents
 */
// ... existing tools ...

import { searchProducts } from './product-catalog';

export const productSearchTool = tool({
  description: 'Search for solar products like inverters, batteries, and panels in the product catalog.',
  inputSchema: z.object({
    query: z.string().describe('Search query (e.g., "5kVA inverter", "lithium battery")'),
    category: z.enum(['inverter', 'battery', 'panel', 'all']).optional().describe('Category to filter by'),
  }),
  execute: async (params) => {
    const products = searchProducts(params.query, params.category);
    return {
      products: products,
      count: products.length,
      searched_for: params.query
    };
  },
});

export const knowledgeSearchTool = tool({
  description: 'Search the company knowledge base for information about policies, shop locations, product FAQs, and general information.',
  // ... existing code ...
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    category: z.enum(['policy', 'location', 'faq', 'all']).optional().describe('Category to filter by'),
    limit: z.number().optional().default(5).describe('Max results to return'),
  }),
  execute: async (params) => {
    return await searchKnowledgeBase(params);
  },
});

/**
 * Location search tool
 */
export const locationSearchTool = tool({
  description: 'Search for shop locations and opening hours.',
  inputSchema: z.object({
    query: z.string().describe('Location or area to search for'),
  }),
  execute: async ({ query }) => {
    return await searchKnowledgeBase({ query, category: 'location' });
  },
});

/**
 * Policy search tool
 */
export const policySearchTool = tool({
  description: 'Search for company policies like warranty, returns, refunds.',
  inputSchema: z.object({
    query: z.string().describe('Policy topic to search for'),
  }),
  execute: async ({ query }) => {
    return await searchKnowledgeBase({ query, category: 'policy' });
  },
});

/**
 * Power consumption calculation tool
 */
export const calculatePowerNeeds = tool({
  description: 'Calculate solar system requirements based on appliances and usage. Returns structured data.',
  inputSchema: z.object({
    appliances: z.array(z.object({
      name: z.string(),
      watts: z.number(),
      count: z.number(),
    })).describe('List of appliances to power'),
    usageHours: z.number().optional().default(8).describe('Desired backup hours (default: 8)'),
  }),
  execute: async ({ appliances, usageHours }) => {
    // 1. Calculate loads
    const appDetails = appliances.map(app => ({
      ...app,
      total: app.watts * app.count
    }));

    const totalLoad = appDetails.reduce((sum, app) => sum + app.total, 0);
    const peakLoad = Math.round(totalLoad * 1.5); // 50% surge margin

    // 2. Recommend Inverter (Round up to standard sizes: 1kVA, 2.5kVA, 3.5kVA, 5kVA, 10kVA)
    let invSize = "1kVA";
    let invCapacity = 1000;

    // Logic to pick inverter size based on Load + 30% safety margin on continuous
    const requiredCapacity = totalLoad * 1.3;

    if (requiredCapacity > 10000) { invSize = "15kVA+"; invCapacity = 15000; }
    else if (requiredCapacity > 7500) { invSize = "10kVA"; invCapacity = 10000; }
    else if (requiredCapacity > 5000) { invSize = "7.5kVA"; invCapacity = 7500; }
    else if (requiredCapacity > 3500) { invSize = "5kVA"; invCapacity = 5000; }
    else if (requiredCapacity > 2500) { invSize = "3.5kVA"; invCapacity = 3500; }
    else if (requiredCapacity > 1500) { invSize = "2.5kVA"; invCapacity = 2500; }
    else if (requiredCapacity > 1000) { invSize = "1.5kVA"; invCapacity = 1500; }

    // 3. Recommend Batteries ( Lead Acid 200Ah 12V assumed for calculation)
    // Energy needed = Total Load * Hours
    // Battery Bank (Ah) = (Energy / System Voltage) / DoD / Efficiency
    // Simplified: 
    const dailyEnergyWh = totalLoad * usageHours;
    const systemVoltage = invCapacity >= 3500 ? (invCapacity >= 5000 ? 48 : 24) : 12;

    // Wh / Voltage = Ah needed. 
    // Real-world factor: DoD 50% * Efficiency 85% = ~0.42 usable
    const requiredAh = dailyEnergyWh / systemVoltage / 0.5 / 0.85;
    const batteryCount = Math.ceil(requiredAh / 200);

    // Ensure battery count matches system voltage (e.g. 24V needs pairs, 48V needs groups of 4)
    let finalBatCount = batteryCount;
    if (systemVoltage === 24 && finalBatCount % 2 !== 0) finalBatCount++;
    if (systemVoltage === 48 && finalBatCount % 4 !== 0) finalBatCount += (4 - (finalBatCount % 4));

    // 4. Recommend Panels (Optional - assuming 5 sun hours)
    // Needed to replenish daily energy + 30% losses
    const arraySizeW = (dailyEnergyWh / 5) * 1.3;
    const panelCount = Math.ceil(arraySizeW / 450); // Assuming 450W panels

    return {
      appliances: appDetails,
      totalLoad,
      peakLoad,
      recommendedInverter: {
        size: invSize,
        reason: `Handles ${totalLoad}W continuous load with safety margin`
      },
      recommendedBattery: {
        capacity: "200Ah",
        voltage: "12V",
        count: finalBatCount,
        backupTime: `${usageHours} Hours`,
        reason: `${dailyEnergyWh}Wh energy storage requirement`
      },
      recommendedPanels: {
        capacity: "450W",
        count: panelCount,
        reason: `Recharges batteries in ~5 hours sunlight`
      }
    };
  },
});

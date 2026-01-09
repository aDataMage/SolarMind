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

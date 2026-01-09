/**
 * Product Catalog Tool for Sales Engineer Agent
 * 
 * Provides search functionality for solar products including inverters,
 * batteries, panels, and complete systems.
 * 
 * Requirements: 2.3
 */

import { tool } from 'ai';
import { z } from 'zod';
import type { SolarProduct, ProductCategory } from '@/lib/domain/models/product';

/** Schema for product search parameters */
export const ProductSearchParamsSchema = z.object({
  category: z.enum(['inverter', 'battery', 'panel', 'complete_system']).optional()
    .describe('Filter by product category'),
  minCapacity: z.number().positive().optional()
    .describe('Minimum capacity in the category\'s standard unit (W for inverters, Wh for batteries)'),
  maxBudget: z.number().positive().optional()
    .describe('Maximum budget in NGN (Nigerian Naira)'),
  brand: z.string().optional()
    .describe('Filter by brand name'),
});

export type ProductSearchParams = z.infer<typeof ProductSearchParamsSchema>;

/** Product search result */
export interface ProductSearchResult {
  products: SolarProduct[];
  totalFound: number;
  filters: ProductSearchParams;
}

/**
 * Mock product catalog with sample solar products
 * In production, this would query a database or external API
 */
import { PRODUCT_CATALOG } from '@/lib/infrastructure/data/products';

/**
 * Searches the product catalog with optional filters
 * 
 * @param params - Search filters (category, minCapacity, maxBudget, brand)
 * @returns Matching products and search metadata
 */
export function searchProductCatalog(params: ProductSearchParams): ProductSearchResult {
  let products = [...PRODUCT_CATALOG];

  // Filter by category
  if (params.category) {
    products = products.filter(p => p.category === params.category);
  }

  // Filter by minimum capacity
  if (params.minCapacity !== undefined) {
    products = products.filter(p => {
      // Normalize capacity to watts for comparison
      const capacityInWatts = normalizeCapacityToWatts(
        p.specifications.capacity,
        p.specifications.capacityUnit
      );
      const minCapacityInWatts = normalizeCapacityToWatts(
        params.minCapacity!,
        p.category === 'battery' ? 'Wh' : 'W'
      );
      return capacityInWatts >= minCapacityInWatts;
    });
  }

  // Filter by maximum budget
  if (params.maxBudget !== undefined) {
    products = products.filter(p => p.price <= params.maxBudget!);
  }

  // Filter by brand
  if (params.brand) {
    const brandLower = params.brand.toLowerCase();
    products = products.filter(p => p.brand.toLowerCase().includes(brandLower));
  }

  // Sort by price (ascending)
  products.sort((a, b) => a.price - b.price);

  return {
    products,
    totalFound: products.length,
    filters: params,
  };
}

/**
 * Normalizes capacity to a common unit (watts or watt-hours) for comparison
 */
function normalizeCapacityToWatts(capacity: number | undefined, unit: string | undefined): number {
  if (!capacity) return 0;

  const unitLower = (unit || '').toLowerCase();

  if (unitLower === 'kw' || unitLower === 'kwh') {
    return capacity * 1000;
  }

  return capacity;
}

/**
 * Formats a product for display in chat responses
 */
export function formatProductForDisplay(product: SolarProduct): string {
  const capacityStr = `${product.specifications.capacity}${product.specifications.capacityUnit}`;
  const priceStr = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(product.price);

  const stockStatus = product.inStock ? '✅ In Stock' : '❌ Out of Stock';

  return `**${product.name}** (${product.brand})
- Capacity: ${capacityStr}
- Price: ${priceStr}
- Status: ${stockStatus}
- ${product.description}`;
}

/**
 * Vercel AI SDK tool definition for product catalog search
 */
export const productCatalogTool = tool({
  description: 'Search the solar product catalog for inverters, batteries, panels, and complete systems. Filter by category, capacity, budget, or brand.',
  inputSchema: ProductSearchParamsSchema,
  execute: async (params: ProductSearchParams) => searchProductCatalog(params),
});

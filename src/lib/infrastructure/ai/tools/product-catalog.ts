/**
 * Product Catalog Data
 * 
 * Mock database of solar products for the AI to recommend.
 */
import { ProductData } from '@/components/chat/product-card';

export const PRODUCT_CATALOG: ProductData[] = [
    // INVERTERS
    {
        id: 'inv-1',
        name: 'Luminous 1kVA Solar Inverter',
        category: 'inverter',
        description: 'Compact hybrid inverter ideal for small homes. Supports 12V battery system.',
        price: 150000,
        specs: { capacity: '1kVA', voltage: '12V', warranty: '2 Years' },
        inStock: true
    },
    {
        id: 'inv-2',
        name: 'Luminous 3.5kVA Inverter',
        category: 'inverter',
        description: 'Powerful inverter for medium homes. Runs TVs, fans, laptops, and lighting.',
        price: 350000,
        specs: { capacity: '3.5kVA', voltage: '24V', warranty: '2 Years' },
        inStock: true
    },
    {
        id: 'inv-3',
        name: 'Schneider 5kW Hybrid Inverter',
        category: 'inverter',
        description: 'Premium hybrid inverter with pure sine wave output. Compatible with lithium batteries.',
        price: 1200000,
        specs: { capacity: '5kW', voltage: '48V', warranty: '5 Years' },
        inStock: true
    },

    // BATTERIES
    {
        id: 'bat-1',
        name: 'Tubular Battery 200Ah',
        category: 'battery',
        description: 'Deep cycle lead-acid battery. Proven reliability for Nigerian conditions.',
        price: 220000,
        specs: { capacity: '200Ah', voltage: '12V', warranty: '18 Months' },
        inStock: true
    },
    {
        id: 'bat-2',
        name: 'Felicity 5kWh Lithium Battery',
        category: 'battery',
        description: 'High-performance LiFePO4 battery. 6000+ cycles life.',
        price: 1800000,
        specs: { capacity: '5kWh', voltage: '48V', warranty: '10 Years' },
        inStock: true
    },

    // PANELS
    {
        id: 'pnl-1',
        name: 'Canadian Solar 450W Panel',
        category: 'panel',
        description: 'Monocrystalline PERC technology for high efficiency in low light.',
        price: 110000,
        specs: { capacity: '450W', voltage: '42V', warranty: '25 Years' },
        inStock: true
    },
    {
        id: 'pnl-2',
        name: 'Jinko 550W Tiger Pro',
        category: 'panel',
        description: 'High-power module for maximizing roof space efficiency.',
        price: 135000,
        specs: { capacity: '550W', voltage: '42V', warranty: '25 Years' },
        inStock: false
    }
];

export function searchProducts(query: string, category?: string): ProductData[] {
    const q = query.toLowerCase().trim();

    // 1. Broad / "Best" queries - return all or top picks
    const broadTerms = ['products', 'solar', 'all', 'equipment', 'best', 'recommend', 'options'];
    if (broadTerms.some(term => q === term || ((q.includes('best') || q.includes('recommend')) && q.length < 20))) {
        // For "best", potentially filter by some "featured" flag or return expensive items, 
        // but for now returning all matching the category is safer.
        return PRODUCT_CATALOG.filter(p => !category || category === 'all' || p.category === category);
    }

    // 2. Tokenize the query for smarter matching
    // Extract potential capacity numbers (e.g. "5kva", "200ah") to handle specific technical searches
    const tokens = q.split(/\s+/).filter(t => t.length > 1);

    const scoredProducts = PRODUCT_CATALOG.map(product => {
        let score = 0;
        const pText = `${product.name} ${product.description} ${product.category} ${JSON.stringify(product.specs)}`.toLowerCase();

        // Check for category filter first
        if (category && category !== 'all' && product.category !== category) {
            return { product, score: -1 };
        }

        // Exact phase match boost
        if (pText.includes(q)) score += 10;

        // Token matching
        tokens.forEach(token => {
            if (pText.includes(token)) score += 3;
            // Partial match (e.g. "5kva" matching "3.5kva") - be careful not to match too broadly
            else if (token.replace(/[^a-z0-9]/g, '') === product.category) score += 2;
        });

        // Numeric capacity matching (simple heuristic)
        // If query has "5kva" and product spec has "5kva" or "5kw", boost it
        const capacityMatch = tokens.some(t => {
            const num = parseFloat(t);
            return !isNaN(num) && pText.includes(num.toString());
        });
        if (capacityMatch) score += 5;

        return { product, score };
    });

    // Filter and sort
    const results = scoredProducts
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);

    // 3. Fallback: If specific search fails but category is present, return all in category
    if (results.length === 0 && category && category !== 'all') {
        return PRODUCT_CATALOG.filter(p => p.category === category);
    }

    // 4. Fallback: If simple keyword match failed, try just matching the category name from query
    if (results.length === 0) {
        const categoryMatch = PRODUCT_CATALOG.filter(p => q.includes(p.category));
        if (categoryMatch.length > 0) return categoryMatch;
    }

    return results;
}


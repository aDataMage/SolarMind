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
    const q = query.toLowerCase();

    return PRODUCT_CATALOG.filter(product => {
        // Filter by category if provided
        if (category && category !== 'all' && product.category !== category) {
            return false;
        }

        // Return all items for broad queries
        const broadTerms = ['products', 'solar', 'all', 'equipment'];
        if (broadTerms.some(term => q.includes(term)) && q.length < 15) {
            return true;
        }

        // Search in name and description
        return product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.specs.capacity?.toLowerCase().includes(q);
    });
}

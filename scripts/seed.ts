import * as dotenv from 'dotenv';
console.log('Script started');
dotenv.config({ path: '.env.local' });
console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No');
import { db } from '../src/lib/infrastructure/database/db';
import { products } from '../src/lib/infrastructure/database/schema';
import * as schema from '../src/lib/infrastructure/database/schema';


async function main() {
    console.log('Main called');

    // Dynamically import to ensure env vars are loaded
    const { db } = await import('../src/lib/infrastructure/database/db');
    const { products } = await import('../src/lib/infrastructure/database/schema');
    const { eq } = await import('drizzle-orm');

    const initialProducts = [
        {
            id: 'p-1',
            slug: 'solarmax-400w-panel',
            name: 'SolarMax 400W Monocrystalline Panel',
            description: 'High-efficiency panel with 22% conversion rate. Perfect for residential rooftops with limited space. Features all-black design for superior aesthetics.',
            price: '299.00',
            category: 'panels',
            rating: 4.8,
            image: '/products/panel-1.png',
            specs: {
                'Dimensions': '1755 x 1038 x 35 mm',
                'Weight': '20.0 kg',
                'Efficiency': '22.6%',
                'Warranty': '25 Years'
            }
        },
        {
            id: 'p-2',
            slug: 'ecoflow-450w-bifacial',
            name: 'EcoFlow 450W Bifacial Panel',
            description: 'Capture sunlight from both sides with this premium bifacial panel. Ideal for ground mounts and commercial installations where reflected light can be harvested.',
            price: '349.00',
            category: 'panels',
            rating: 4.9,
            image: '/products/panel-1.png',
            specs: {
                'Type': 'Bifacial Monocrystalline',
                'Output': '450W Front / +25% Rear',
                'Glass': 'Dual Tempered'
            }
        },
        {
            id: 'b-1',
            slug: 'powerwall-battery',
            name: 'PowerWall Home Battery 13.5kWh',
            description: 'The ultimate home energy storage solution. Store excess solar energy for use at night or during outages. Seamless backup power with a minimalist design.',
            price: '8500.00',
            category: 'batteries',
            rating: 5.0,
            image: '/products/battery-1.png',
            specs: {
                'Capacity': '13.5 kWh',
                'Power': '7kW Peak / 5kW Continuous',
                'Installation': 'Floor or Wall Mounted',
                'Weight': '114 kg'
            }
        },
        {
            id: 'b-2',
            slug: 'sunvault-storage',
            name: 'SunVault Storage 10kWh',
            description: 'Modular battery system compatible with most hybrid inverters. Expandable design allows you to stack up to 4 units for massive storage capacity.',
            price: '6200.00',
            category: 'batteries',
            rating: 4.7,
            image: '/products/battery-1.png',
            specs: {
                'Capacity': '10 kWh',
                'Technology': 'LiFePO4',
                'Cycle Life': '>6000 cycles'
            }
        },
        {
            id: 'k-1',
            slug: 'tiny-home-kit',
            name: 'Tiny Home Off-Grid Kit',
            description: 'Complete 2kW solar system with inverter and small battery bank. Ideal for cabins, RVs, and tiny homes. Includes everything you need to get off the grid.',
            price: '3500.00',
            category: 'kits',
            rating: 4.6,
            image: '/products/kit-1.png',
            specs: {
                'System Size': '2 kW',
                'Inverter': '3kW Hybrid',
                'Daily Output': '~8 kWh',
                'Battery': '2.4kWh LFP'
            }
        },
        {
            id: 'i-1',
            slug: 'hybrid-inverter-5kw',
            name: 'Hybrid Inverter 5kW',
            description: 'Smart inverter that manages solar, battery, and grid connections efficiently. Features an advanced touch display and mobile app monitoring.',
            price: '1200.00',
            category: 'inverters',
            rating: 4.8,
            image: '/products/inverter-1.png',
            specs: {
                'Max Output': '5000W',
                'MPPTs': '2',
                'Efficiency': '97.6%',
                'Communication': 'WiFi / LAN / 4G'
            }
        }
    ];

    console.log('🌱 Seeding database...');

    try {
        console.log('Connecting to DB...');
        for (const product of initialProducts) {
            console.log(`Checking product ${product.id}...`);
            // Check if exists
            const existing = await db.select().from(products).where(eq(products.id, product.id));

            if (existing.length === 0) {
                await db.insert(products).values(product);
                console.log(`+ Inserted: ${product.name}`);
            } else {
                await db.update(products).set(product).where(eq(products.id, product.id));
                console.log(`~ Updated: ${product.name}`);
            }
        }
        console.log('✅ Seeding complete.');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

main().then(() => {
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

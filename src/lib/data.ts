import { Product } from './actions/product';

export const products: Product[] = [
    // --- Panels ---
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

    // --- Batteries ---
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

    // --- Inverters ---
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
    },

    // --- Installation Plans (Bundles) ---
    {
        id: 'plan-1',
        slug: '3kva-basic-home-starter',
        name: '3kVA Basic Home Starter Plan',
        description: 'Perfect for small apartments or entry-level solar needs. Powers minimal loads like lighting, fans, TVs, and laptops.',
        price: '4500.00',
        category: 'plans',
        rating: 4.5,
        image: '/products/kit-1.png', // Reusing kit image for now
        specs: {
            'Inverter': '3kVA Hybrid',
            'Battery': '2x 200Ah Tubular',
            'Panels': '4x 300W Mono',
            'Load Capacity': 'Lights, Fans, TV, Laptop'
        }
    },
    {
        id: 'plan-2',
        slug: '5kva-family-comfort',
        name: '5kVA Family Comfort Package',
        description: 'Our best-seller for medium-sized homes. Capable of powering fridges, freezers, pumping machines, and all standard electronics.',
        price: '8900.00',
        category: 'plans',
        rating: 4.9,
        image: '/products/kit-1.png',
        specs: {
            'Inverter': '5kVA Hybrid',
            'Battery': '4x 200Ah Gel / 1x 5kWh Lithium',
            'Panels': '8x 450W Mono',
            'Load Capacity': 'Fridge, Freezer, Pump, Lighting'
        }
    },
    {
        id: 'plan-3',
        slug: '10kva-executive-power',
        name: '10kVA Executive Power Station',
        description: 'For large homes or small offices requiring 24/7 power independence. Handles AC units (inverter type), multiple fridges, and heavy office equipment.',
        price: '18500.00',
        category: 'plans',
        rating: 5.0,
        image: '/products/kit-1.png',
        specs: {
            'Inverter': '10kVA Industrial Grade',
            'Battery': '15kWh Lithium Bank',
            'Panels': '20x 550W Bifacial',
            'Load Capacity': 'ACs, Office Equipment, Full Home'
        }
    },

    // --- Appliances ---
    {
        id: 'app-1',
        slug: 'solar-fan-16inch',
        name: '16" Rechargeable Solar Fan',
        description: 'Beat the heat with zero electricity costs. Built-in lithium battery lasts up to 12 hours on low speed. Includes remote control and USB charging port.',
        price: '85.00',
        category: 'appliances',
        rating: 4.6,
        image: '/products/kit-1.png', // Need separate image later
        specs: {
            'Blade Size': '16 Inch',
            'Battery': '12V 5Ah',
            'Speed Levels': '5',
            'Solar Panel': 'Included (20W)'
        }
    },
    {
        id: 'app-2',
        slug: 'solar-pump-1hp',
        name: '1HP Solar Submersible Pump',
        description: 'Reliable water supply for agriculture or home use. Direct DC solar connection means no inverter needed. High flow rate and durable stainless steel body.',
        price: '450.00',
        category: 'appliances',
        rating: 4.7,
        image: '/products/kit-1.png',
        specs: {
            'Power': '1HP (750W)',
            'Max Head': '80m',
            'Flow Rate': '3000 L/h',
            'Voltage': '72V DC'
        }
    }
];

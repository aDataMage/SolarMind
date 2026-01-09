'use client';

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Leaf, Coins } from 'lucide-react';

const features = [
    {
        name: 'Maximum Efficiency',
        description: 'Our Tier-1 monocrystalline panels deliver industry-leading energy conversion rates even in low light.',
        icon: Zap,
    },
    {
        name: '25-Year Warranty',
        description: 'Invest with confidence. We guarantee performance and durability for a quarter of a century.',
        icon: ShieldCheck,
    },
    {
        name: 'Eco-Friendly',
        description: 'Reduce your carbon footprint significantly. One installation offsets tons of CO2 over its lifetime.',
        icon: Leaf,
    },
    {
        name: 'Smart Savings',
        description: 'Drastically reduce or eliminate your electricity bill and protect yourself from rising utility rates.',
        icon: Coins,
    },
];

export function Features() {
    return (
        <div className="bg-muted/30 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Why Choose SolarMind?</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">
                        Everything you need to power your home
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        We don't just sell panels; we engineer complete energy independence systems tailored to your lifestyle.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.name}
                                className="relative pl-16"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <dt className="text-base font-semibold leading-7 text-foreground">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                        <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}

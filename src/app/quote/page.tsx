'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { products } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Lightbulb, Tv, Fan, Refrigerator, Laptop, Wind } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists, else I'll use template literals

// Appliance options with typical wattage
const appliances = [
    { id: 'light', name: 'Light Bulb (LED)', watts: 10, icon: Lightbulb },
    { id: 'fan', name: 'Ceiling Fan', watts: 75, icon: Fan },
    { id: 'tv', name: 'LED TV (42")', watts: 100, icon: Tv },
    { id: 'fridge', name: 'Refrigerator', watts: 200, icon: Refrigerator },
    { id: 'laptop', name: 'Laptop', watts: 65, icon: Laptop },
    { id: 'ac', name: 'Inverter AC (1HP)', watts: 1000, icon: Wind },
    { id: 'pump', name: 'Water Pump (1HP)', watts: 750, icon: Zap },
];

export default function QuoteBuilder() {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState<Record<string, number>>({});
    const [totalLoad, setTotalLoad] = useState(0);

    const updateSelection = (id: string, delta: number) => {
        setSelections(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const calculateLoad = () => {
        let load = 0;
        Object.entries(selections).forEach(([id, count]) => {
            const appliance = appliances.find(a => a.id === id);
            if (appliance) {
                load += appliance.watts * count;
            }
        });
        setTotalLoad(load);
        setStep(2);
    };

    const getRecommendation = () => {
        // Simple logic to map load to plans
        // Plans:
        // 3kVA (Basic) ~ supports up to 500-800W continuous broadly, peaks higher but let's be safe. 
        // Actually 3kVA is ~2400W but battery limit is key. 
        // Let's assume:
        // < 500W avg load -> 3kVA Basic
        // 500W - 1500W -> 5kVA Family
        // > 1500W -> 10kVA Executive

        // Note: These heuristics are simplified for the demo.

        let recommendedSlug = '';

        if (totalLoad === 0) return null;
        if (totalLoad <= 800) recommendedSlug = '3kva-basic-home-starter';
        else if (totalLoad <= 2000) recommendedSlug = '5kva-family-comfort';
        else recommendedSlug = '10kva-executive-power';

        return products.find(p => p.slug === recommendedSlug);
    };

    const recommendation = getRecommendation();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-heading mb-4">Build Your Solar System</h1>
                    <p className="text-muted-foreground text-lg">
                        Tell us what you want to power, and we'll recommend the perfect setup.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appliances.map((app) => (
                                    <div key={app.id} className="bg-white dark:bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <app.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                <div className="text-xs text-muted-foreground">{app.watts} Watts</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateSelection(app.id, -1)}
                                                className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted"
                                                disabled={!selections[app.id]}
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-medium">{selections[app.id] || 0}</span>
                                            <button
                                                onClick={() => updateSelection(app.id, 1)}
                                                className="h-8 w-8 rounded-full bg-primary text-secondary-foreground flex items-center justify-center hover:bg-primary/90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-12">
                                <Button
                                    size="lg"
                                    className="px-8 py-6 text-lg rounded-full"
                                    onClick={calculateLoad}
                                    disabled={Object.values(selections).every(v => !v)}
                                >
                                    Calculate Requirements <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && recommendation && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card to-secondary/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-primary/10 text-primary px-4 py-2 rounded-bl-xl font-bold text-sm">
                                    RECOMMENDED FOR YOU
                                </div>

                                <div className="mb-8">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Estimated Load</div>
                                    <div className="text-5xl font-bold text-foreground">{totalLoad} <span className="text-2xl text-muted-foreground">Watts</span></div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary mb-2">{recommendation.name}</h3>
                                        <p className="text-muted-foreground">{recommendation.description}</p>
                                    </div>

                                    <div className="bg-background rounded-lg p-6 border shadow-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            {recommendation.specs && Object.entries(recommendation.specs).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="text-xs text-muted-foreground">{key}</div>
                                                    <div className="font-medium">{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <Link href={`/shop/${recommendation.slug}`} className="flex-1">
                                            <Button size="lg" className="w-full h-12 text-base">
                                                View Plan Details
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="flex-1 h-12"
                                            onClick={() => setStep(1)}
                                        >
                                            Recalculate
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="mt-8 text-center text-sm text-muted-foreground">
                                <p>Note: This is a robust estimation. Our engineers will verify your exact needs before final installation.</p>
                            </div>
                        </motion.div>
                    )}
                    {step === 2 && !recommendation && (
                        <div className="text-center">
                            <p className="mb-4">No load items selected.</p>
                            <Button onClick={() => setStep(1)}>Go Back</Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

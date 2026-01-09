'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-20 sm:py-32 lg:pb-32 xl:pb-36">
            {/* Background Gradients */}
            <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        background: 'linear-gradient(to top right, var(--color-primary), var(--color-secondary))'
                    }}
                />
            </div>

            <div className="container relative z-10 px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium mb-6 border border-secondary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                </span>
                                #1 Rated Solar Installer 2025
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl font-heading leading-[1.1]"
                        >
                            Power Your Future with <span className="text-primary">Solar Energy</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl leading-relaxed"
                        >
                            Sustainable energy solutions for modern homes. Reduce your carbon footprint and eliminate electricity bills with our premium solar panels and battery systems.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20">
                                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                                <a href="#features">Explore Solutions</a>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-12 flex items-center gap-8 text-sm text-muted-foreground"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-foreground">10k+</span>
                                <span>Installations</span>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-foreground">25yr</span>
                                <span>Warranty</span>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-foreground">0%</span>
                                <span>Financing</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border aspect-square lg:aspect-[4/3] bg-muted">
                            {/* Placeholder for real image */}

                            {/* CSS Art / Gradient replacement for now */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black">
                                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                                <div className="h-full w-full flex items-center justify-center">
                                    <span className="text-secondary/20 font-bold text-9xl select-none">SOLAR</span>
                                </div>

                                {/* Abstract Panel overlay */}
                                <div className="absolute bottom-10 left-10 right-10 top-10 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center">
                                    <p className="text-white/50 font-medium">High Efficiency PV System Image</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border flex items-center gap-4"
                        >
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <div>
                                <p className="font-bold text-foreground">Offset 100%</p>
                                <p className="text-xs text-muted-foreground">of your energy usage</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

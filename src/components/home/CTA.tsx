'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-primary/10 -skew-y-3 transform origin-bottom-right" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="bg-card border rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <Zap className="h-4 w-4" />
                            <span>Start Saving Today</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground">
                            Ready to Power Your Home with the Sun?
                        </h2>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                            Join thousands of homeowners who have switched to renewable energy.
                            Get a custom quote in less than 24 hours.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" className="h-12 w-full sm:w-auto px-8 text-base shadow-lg shadow-primary/25">
                                Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
                                <Link href="/contact">Contact Sales</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

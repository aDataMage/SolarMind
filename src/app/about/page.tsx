'use client';

import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="relative isolate overflow-hidden bg-background py-24 sm:py-32">
                {/* Background Decoration */}
                <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
                    <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-heading"
                        >
                            We are SolarMind
                        </motion.h2>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Our mission is to democratize energy. We believe that generating your own clean power should be simple, affordable, and beautiful. Founded in 2024, we've helped thousands of homeowners break free from the grid.
                        </p>
                    </div>
                    <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-foreground sm:grid-cols-2 md:flex lg:gap-x-10">
                            <a href="#">Open roles <span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Internship program <span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Our values <span aria-hidden="true">&rarr;</span></a>
                            <a href="#">Meet our leadership <span aria-hidden="true">&rarr;</span></a>
                        </div>
                        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="flex flex-col-reverse">
                                <dt className="text-base leading-7 text-muted-foreground">Offices worldwide</dt>
                                <dd className="text-2xl font-bold leading-9 tracking-tight text-foreground">12</dd>
                            </div>
                            <div className="flex flex-col-reverse">
                                <dt className="text-base leading-7 text-muted-foreground">Full-time colleagues</dt>
                                <dd className="text-2xl font-bold leading-9 tracking-tight text-foreground">300+</dd>
                            </div>
                            <div className="flex flex-col-reverse">
                                <dt className="text-base leading-7 text-muted-foreground">Hours per week</dt>
                                <dd className="text-2xl font-bold leading-9 tracking-tight text-foreground">40</dd>
                            </div>
                            <div className="flex flex-col-reverse">
                                <dt className="text-base leading-7 text-muted-foreground">Paid time off</dt>
                                <dd className="text-2xl font-bold leading-9 tracking-tight text-foreground">Unlimited</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mt-32 pb-32 sm:mt-40 xl:mx-auto xl:max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">Our Values</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        We are driven by a commitment to sustainability, transparency, and engineering excellence.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                <Sun className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                Sustainability First
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto">Every decision we make is weighed against its impact on our planet. We prioritize recyclable materials and ethical supply chains.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                <Sun className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                Radical Transparency
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto">No hidden fees, no confusing contracts. We explain exactly what you're buying and how much you'll save.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                <Sun className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                                Customer Obsession
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto">We don't consider the job done until you are powering your home with the sun and smiling about it.</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">Contact Us</h2>
                    <p className="mt-2 text-lg leading-8 text-muted-foreground">
                        Have questions about solar installation? Our team of experts is ready to help you switch to clean energy.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-20 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold leading-7 text-primary">Get in touch</h3>
                        <div className="mt-6 space-y-8 text-base leading-7 text-muted-foreground">
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Address</span>
                                    <MapPin className="h-7 w-6 text-foreground" aria-hidden="true" />
                                </dt>
                                <dd>123 Solar Boulevard<br />Sunnyvale, CA 94086</dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Telephone</span>
                                    <Phone className="h-7 w-6 text-foreground" aria-hidden="true" />
                                </dt>
                                <dd><a className="hover:text-foreground" href="tel:+1 (555) 234-5678">+1 (555) 234-5678</a></dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Email</span>
                                    <Mail className="h-7 w-6 text-foreground" aria-hidden="true" />
                                </dt>
                                <dd><a className="hover:text-foreground" href="mailto:hello@solarmind.com">hello@solarmind.com</a></dd>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-y-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-foreground">First name</label>
                                <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="mt-2.5 block w-full rounded-md border-input bg-background px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-foreground">Last name</label>
                                <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="mt-2.5 block w-full rounded-md border-input bg-background px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-foreground">Email</label>
                            <input type="email" name="email" id="email" autoComplete="email" className="mt-2.5 block w-full rounded-md border-input bg-background px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-foreground">Message</label>
                            <textarea name="message" id="message" rows={4} className="mt-2.5 block w-full rounded-md border-input bg-background px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                        </div>
                        <Button type="submit" size="lg" className="w-full">
                            Send Message
                        </Button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
}

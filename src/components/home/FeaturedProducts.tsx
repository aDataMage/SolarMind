'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'SolarMax 400W Panel',
        price: '$299.00',
        category: 'Solar Panels',
        image: '/products/panel-1.png',
        href: '/shop/solarmax-400w-panel',
    },
    {
        id: 2,
        name: 'PowerWall Home Battery',
        price: '$8,500.00',
        category: 'Batteries',
        image: '/products/battery-1.png',
        href: '/shop/powerwall-battery',
    },
    {
        id: 3,
        name: 'Tiny Home Off-Grid Kit',
        price: '$3,500.00',
        category: 'Kits',
        image: '/products/kit-1.png',
        href: '/shop/tiny-home-kit',
    },
];

export function FeaturedProducts() {
    return (
        <div className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">Featured Products</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Top-rated equipment for your renewable journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-64 relative">
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                            </div>
                            <div className="mt-4 flex justify-between px-4">
                                <div>
                                    <h3 className="text-sm font-medium text-foreground">
                                        <Link href={product.href}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                                </div>
                                <p className="text-sm font-medium text-foreground">{product.price}</p>
                            </div>
                            <div className="px-4 pb-4 mt-4">
                                <Button className="w-full gap-2 relative z-10">
                                    Add to Cart <ShoppingCart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/shop">
                        <Button variant="outline" size="lg">View All Products</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

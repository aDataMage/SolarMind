'use client';

import * as React from 'react';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/solar/ProductCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = React.useState<string | 'all'>('all');

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const categories = ['all', 'panels', 'batteries', 'inverters', 'kits', 'accessories'];

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="bg-muted/30 py-12 border-b">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading">Shop Solar Equipment</h1>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                        Premium commercial and residential solar hardware. Direct to consumer pricing.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 lg:mt-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-64 flex-none space-y-8">
                        <div className="hidden lg:block">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" /> Filters
                            </h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === cat
                                                ? 'bg-primary/10 text-primary font-medium'
                                                : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Filter (simplified) */}
                        <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                            {categories.map(cat => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(cat)}
                                    className="whitespace-nowrap"
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No products found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

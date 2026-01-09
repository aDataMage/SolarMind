'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/actions/product';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/solar/ProductCard';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
    const { addItem } = useCartStore();

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-foreground">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="aspect-square bg-muted rounded-xl overflow-hidden flex items-center justify-center border relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-primary/5 group-hover:opacity-100 transition-opacity" />

                        {product.image && !product.image.includes('placehold') ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="text-muted-foreground flex flex-col items-center relative z-10">
                                <span className="text-6xl mb-4">☀️</span>
                                <span className="text-lg font-medium">{product.name}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div>
                            <h1 className="text-3xl font-bold font-heading text-foreground sm:text-4xl leading-tight">{product.name}</h1>
                            <div className="mt-4 flex items-center gap-4">
                                <p className="text-3xl font-bold text-primary">${parseFloat(product.price).toLocaleString()}</p>
                                <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full text-sm font-medium text-secondary-foreground">
                                    <Star className="h-4 w-4 fill-current" />
                                    {product.rating} <span className="text-muted-foreground ml-1 font-normal">(Verified)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 text-sm text-foreground/80 bg-muted/50 p-3 rounded-lg border">
                                    <Truck className="h-5 w-5 text-primary" />
                                    <span>Free Shipping over $1000</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-foreground/80 bg-muted/50 p-3 rounded-lg border">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <span>25-Year Performance Warranty</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t space-y-4">
                                <Button size="lg" className="w-full h-14 text-lg px-8 gap-3 shadow-lg shadow-primary/20" onClick={() => addItem(product)}>
                                    Add to Cart <ShoppingCart className="h-5 w-5" />
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">Secure transaction • 30-day money back guarantee</p>
                            </div>
                        </div>

                        {/* Specs - Improved with definition list for semantic value */}
                        <div className="mt-12 bg-muted/20 p-6 rounded-xl border">
                            <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-sm">
                                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-2 border-b last:border-0 border-border/50">
                                        <dt className="text-muted-foreground">{key}</dt>
                                        <dd className="font-medium text-foreground">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t pt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-heading">Related Products</h2>
                            <Link href="/shop" className="text-primary hover:underline text-sm font-medium">View All</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

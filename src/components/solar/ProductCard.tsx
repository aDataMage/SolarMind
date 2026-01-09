'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/data';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
            <Link href={`/shop/${product.slug}`} className="aspect-[4/3] w-full overflow-hidden bg-muted">
                {/* 
            In real app use: <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" /> 
            Using placeholder text for now if image is generic placeholder url
          */}
                <div className="h-full w-full flex items-center justify-center bg-secondary/10 text-muted-foreground p-4 text-center">
                    {product.image && !product.image.includes('placehold') ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <span className="text-xs">{product.name} Image</span>
                    )}
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">
                            <Link href={`/shop/${product.slug}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground capitalize">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded text-xs font-medium text-secondary-foreground">
                        <Star className="h-3 w-3 fill-current" />
                        {product.rating}
                    </div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">
                        ${product.price.toLocaleString()}
                    </p>
                    <Button
                        size="sm"
                        className="relative z-10 gap-2"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            addItem(product);
                        }}
                    >
                        Add <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

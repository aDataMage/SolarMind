'use server';

import { db } from '@/lib/infrastructure/database/db';
import { products } from '@/lib/infrastructure/database/schema';
import { eq, like, or } from 'drizzle-orm';

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: string; // Decimal comes as string from DB usually, or number
    category: string;
    rating: number | null;
    image: string | null;
    specs: Record<string, string> | null;
}

export async function getProducts(category?: string): Promise<Product[]> {
    try {
        if (category && category !== 'all') {
            const result = await db.select().from(products).where(eq(products.category, category));
            return result as unknown as Product[];
        }
        const result = await db.select().from(products);
        return result as unknown as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
        if (result.length === 0) return null;
        return result[0] as unknown as Product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getFeaturedProducts(): Promise<Product[]> {
    // For now, just return first 4, or verify logic
    try {
        const result = await db.select().from(products).limit(4);
        return result as unknown as Product[];
    } catch (error) {
        return [];
    }
}

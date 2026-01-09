import * as React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { products } from '@/lib/data';
import { ProductDetail } from '@/components/solar/ProductDetail';
import { JsonLd } from '@/components/seo/JsonLd';

// Next.js 15: params is a Promise
interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.description.slice(0, 160),
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.image || '/og-image.jpg'],
            type: 'website', // changed from product to website for broader compatibility, or keep product for precise graph
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return notFound();
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    // Product Schema for SEO/GEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image ? [product.image] : [],
        description: product.description,
        sku: product.id,
        brand: {
            '@type': 'Brand',
            name: 'SolarMind'
        },
        offers: {
            '@type': 'Offer',
            url: `https://solarmind.com/shop/${product.slug}`,
            priceCurrency: 'USD',
            price: parseFloat(product.price),
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition'
        },
        ...(product.rating ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: 12 // Placeholder or real count if available
            }
        } : {})
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <ProductDetail product={product} relatedProducts={relatedProducts} />
        </>
    );
}

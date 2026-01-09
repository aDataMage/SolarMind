'use client';

import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';

export default function BlogListingPage() {
    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="bg-muted/30 py-20 border-b">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-heading">The Solar Journal</h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Insights, news, and guides on renewable energy, battery storage, and sustainable living.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16">
                {/* Featured Post */}
                <div className="relative rounded-2xl overflow-hidden bg-card border mb-16 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="h-64 lg:h-auto bg-muted flex items-center justify-center p-8 bg-secondary/10">
                            <span className="text-2xl font-bold text-muted-foreground">Featured Image</span>
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-sm text-primary font-bold mb-4 uppercase tracking-wider">
                                {featuredPost.category}
                            </div>
                            <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">
                                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                                    {featuredPost.title}
                                </Link>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4">
                                <Button asChild align="start">
                                    <Link href={`/blog/${featuredPost.slug}`}>Read Article</Link>
                                </Button>
                                <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map(post => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                    {/* Duplicate for visual fullness if needed, or in real app pagination */}
                    {otherPosts.map(post => (
                        <BlogCard key={post.slug + 'dup'} post={{ ...post, slug: post.slug + '-2', title: post.title + ' (Copy)' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

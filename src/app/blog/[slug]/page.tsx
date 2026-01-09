'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Twitter, Share2 } from 'lucide-react';
import { blogPosts } from '@/lib/blog-data';
import { Button } from '@/components/ui/button';

export default function BlogPostPage() {
    const params = useParams();
    const post = blogPosts.find(p => p.slug === params.slug);

    if (!post) {
        return notFound();
    }

    return (
        <article className="bg-background min-h-screen pb-24">
            {/* Hero / Header */}
            <div className="bg-muted/30 pt-24 pb-12 border-b">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-primary font-bold mb-6 uppercase tracking-wider">
                        {post.category}
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold font-heading text-foreground leading-tight"
                    >
                        {post.title}
                    </motion.h1>

                    <div className="flex items-center gap-6 mt-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-foreground">{post.author.name}</div>
                                <div className="text-xs text-muted-foreground">Author</div>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" /> {post.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" /> {post.readTime}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-4xl mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/80"
                >
                    {/* Cover Image Placeholder */}
                    <div className="aspect-video w-full bg-muted rounded-xl mb-8 flex items-center justify-center text-muted-foreground bg-secondary/10">
                        {post.title} Cover Image
                    </div>

                    <p className="lead text-xl text-muted-foreground font-medium mb-8">
                        {post.excerpt}
                    </p>

                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </motion.div>

                {/* Sidebar / Share (Desktop) */}
                <div className="hidden lg:block w-16">
                    <div className="sticky top-24 flex flex-col gap-4">
                        <p className="text-xs font-bold text-muted-foreground text-center mb-2 uppercase tracking-wide">Share</p>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Facebook className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}

import Link from 'next/link';
import { BlogPost } from '@/lib/blog-data';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg group">
            <Link href={`/blog/${post.slug}`} className="aspect-video w-full overflow-hidden bg-muted block">
                <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-muted-foreground group-hover:scale-105 transition-transform duration-500">
                    <span>{post.title} Image</span>
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                    </Link>
                </h3>
                <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {post.author.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{post.author.name}</span>
                </div>
            </div>
        </article>
    );
}

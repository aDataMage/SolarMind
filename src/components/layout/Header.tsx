'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Sun, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useCartStore } from '@/store/useCartStore';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();
    const { totalItems, setIsOpen: setCartOpen } = useCartStore();
    const cartItemCount = totalItems();

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle hydration mismatch for local storage
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Sun className="h-6 w-6 text-primary fill-primary" />
                        <span>SOLAR<span className="text-primary">MIND</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 hover:bg-accent rounded-full transition-colors group"
                            onClick={() => setCartOpen(true)}
                        >
                            <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full animate-in zoom-in" />
                            )}
                        </button>

                        <ModeToggle />

                        <Button
                            variant="default"
                            size="sm"
                            className="hidden md:flex gap-2 font-semibold shadow-lg shadow-primary/20"
                            asChild
                        >
                            <Link href="/quote">
                                Get Quote <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden p-2" onClick={toggleMenu}>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b bg-background"
                        >
                            <nav className="flex flex-col p-4 gap-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "text-lg font-medium transition-colors hover:text-primary",
                                            pathname === item.href ? "text-primary" : "text-foreground"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Button className="w-full mt-4" asChild>
                                    <Link href="/quote">Get a Quote</Link>
                                </Button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            <CartDrawer />
        </>
    );
}

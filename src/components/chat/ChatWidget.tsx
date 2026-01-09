'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function ChatWidget() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Hide widget when on the chat page itself
    const isChatPage = pathname === '/chat';

    useEffect(() => {
        // Show after a small delay on mount
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isChatPage) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Link href="/chat">
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                        >
                            <MessageCircle className="h-7 w-7 text-primary-foreground" />
                            <span className="sr-only">Open AI Chat</span>

                            {/* Pulse effect */}
                            <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
                        </Button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

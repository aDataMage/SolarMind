"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionChipsProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    isLoading?: boolean;
    className?: string;
}

export function SuggestionChips({
    suggestions,
    onSelect,
    isLoading = false,
    className,
}: SuggestionChipsProps) {
    if (suggestions.length === 0 || isLoading) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "flex flex-wrap gap-2 px-4 py-3",
                className
            )}
        >
            <AnimatePresence mode="popLayout">
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: 0.15,
                            delay: index * 0.05,
                        }}
                        onClick={() => onSelect(suggestion)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                            "text-sm font-medium",
                            "bg-muted/50 backdrop-blur-sm border border-border",
                            "text-foreground",
                            "hover:bg-primary/10 hover:border-primary/50",
                            "hover:text-primary",
                            "transition-all duration-200",
                            "cursor-pointer",
                            "shadow-sm hover:shadow-md"
                        )}
                    >
                        <Sparkles className="w-3 h-3 opacity-60" />
                        {suggestion}
                    </motion.button>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

// Initial suggestions - customize for your industry
export const INITIAL_SUGGESTIONS = [
    "Tell me about your services",
    "How can you help me?",
    "What are your pricing options?",
    "I have a question about...",
];

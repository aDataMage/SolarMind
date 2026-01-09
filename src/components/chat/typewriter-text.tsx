"use client";

import { motion } from "framer-motion";

/**
 * Simple fade-in reveal for completed messages
 */
export function FadeInText({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export function CartDrawer() {
    const { items, removeItem, updateQuantity, totalPrice, isOpen, setIsOpen } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 z-50 h-full w-full sm:w-[400px] border-l bg-background shadow-xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" /> Shopping Cart
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                    <ShoppingBag className="h-12 w-12 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 flex-none rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                            <span className="text-[10px] text-center text-muted-foreground p-1">{item.name}</span>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between">
                                                <Link
                                                    href={`/shop/${item.id}`}
                                                    className="font-medium text-sm hover:underline line-clamp-2"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="font-semibold text-sm ml-2">
                                                    ${(parseFloat(item.price) * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-muted"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-xs w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-muted"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t p-4 space-y-4 bg-muted/20">
                                <div className="flex justify-between text-base font-medium">
                                    <p>Subtotal</p>
                                    <p>${totalPrice().toLocaleString()}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                                <Button className="w-full" size="lg">Checkout</Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

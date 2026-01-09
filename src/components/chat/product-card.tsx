/**
 * COMPONENT: Product Card
 * 
 * FUNCTION: Displays a solar product with specs and pricing.
 */
import { Battery, Zap, Sun, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductData {
    id: string;
    name: string;
    category: 'inverter' | 'battery' | 'panel';
    description: string;
    price: number;
    specs: {
        capacity?: string; // e.g., "5kVA", "200Ah", "550W"
        voltage?: string;  // e.g., "48V", "12V"
        warranty: string;
    };
    inStock: boolean;
}

interface ProductCardProps {
    product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
    const Icon = product.category === 'inverter' ? Zap :
        product.category === 'battery' ? Battery : Sun;

    return (
        <div className={cn(
            "group w-full max-w-sm rounded-xl overflow-hidden cursor-pointer",
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
            "shadow-sm hover:shadow-md hover:-translate-y-0.5",
            "transition-all duration-300"
        )}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                product.category === 'inverter' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                    product.category === 'battery' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            )}>
                                {product.category}
                            </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {product.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Specs */}
            <div className="px-5 pb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Capacity</span>
                        <span className="font-medium text-slate-900 dark:text-slate-200">{product.specs.capacity || '-'}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Voltage</span>
                        <span className="font-medium text-slate-900 dark:text-slate-200">{product.specs.voltage || '-'}</span>
                    </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {product.description}
                </p>
            </div>

            {/* Footer: Price & Stock */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                            ₦{product.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">{product.specs.warranty} Warranty</p>
                    </div>

                    {product.inStock ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            In Stock
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

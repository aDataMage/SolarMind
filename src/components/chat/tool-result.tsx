/**
 * COMPONENT: Tool Result Renderer
 * 
 * Routes tool invocation results to the appropriate UI component.
 * Customize this for your specific industry tools.
 */
import { Info, AlertTriangle, Search, MessageSquare, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard, ProductData } from "./product-card";
import { PowerAnalysisCard } from "./power-analysis-card";


interface ToolResultProps {
    toolName: string;
    state: 'partial-call' | 'call' | 'result';
    args?: Record<string, unknown>;
    result?: unknown;
    toolCallId?: string;
    onToolResult?: (toolCallId: string, result: any) => void;
}

export function ToolResult({ toolName, state, args, result, toolCallId, onToolResult }: ToolResultProps) {
    // Show loading state for pending tool calls
    if (state === 'partial-call' || state === 'call') {
        return (
            <div className={cn(
                "w-full max-w-md rounded-2xl overflow-hidden",
                "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                "shadow-sm"
            )}>
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                            <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle different tool types - customize these for your industry
    switch (toolName) {
        case 'searchKnowledge': {
            // Don't show knowledge results as cards - let the AI synthesize a response
            return null;
        }

        case 'searchProducts': {
            const data = result as { products: ProductData[], count: number, searched_for: string };
            if (!data?.products?.length) {
                return <InfoCard message={`No products found for "${data?.searched_for || 'your search'}".`} />;
            }
            return (
                <div className="flex flex-col gap-3 mt-2 min-w-[300px]">
                    <div className="flex flex-col gap-3">
                        {data.products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            );
        }

        case 'calculatePowerNeeds': {
            // Transform linear tool output to structured UI props
            const rawData = result as any;

            const transformedData = {
                appliances: rawData.appliances.map((app: any) => ({
                    name: app.name,
                    watts: app.wattage,
                    count: 1, // Tool doesn't track count per appliance entry derived from list
                    total: app.wattage // Total for this entry
                })),
                totalLoad: rawData.totalWattage,
                peakLoad: rawData.totalWattage, // Assuming constant load for peak in simple calc
                recommendedInverter: {
                    size: `${rawData.recommendedInverterWatts}W`,
                    reason: "Rated for peak load + 25% safety margin"
                },
                recommendedBattery: {
                    capacity: `${rawData.requiredBatteryCapacityKwh.toFixed(2)}kWh`,
                    count: 1,
                    voltage: "System Voltage (12V/24V/48V)", // simplified
                    backupTime: `${rawData.backupHours} Hours`,
                    reason: `Required to sustain load for ${rawData.backupHours}h`
                }
            };

            return <PowerAnalysisCard {...transformedData} />;
        }


        case 'escalateToHuman': {
            const data = result as { escalated?: boolean; message?: string; ticketId?: string };
            return (
                <div className={cn(
                    "w-full max-w-md rounded-2xl overflow-hidden",
                    "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50",
                )}>
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                    Escalated to Human Agent
                                </h4>
                                {data?.ticketId && (
                                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                                        Ticket: <span className="font-mono font-medium">{data.ticketId}</span>
                                    </p>
                                )}
                                {data?.message && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        default:
            // Generic success/info display for unknown tools
            if (result && typeof result === 'object' && 'message' in result) {
                return <InfoCard message={(result as { message: string }).message} />;
            }
            return null;
    }
}

function InfoCard({ message }: { message: string }) {
    return (
        <div className={cn(
            "w-full max-w-md rounded-xl overflow-hidden",
            "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50"
        )}>
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                        <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{message}</p>
                </div>
            </div>
        </div>
    );
}

function ErrorCard({ message }: { message: string }) {
    return (
        <div className={cn(
            "w-full max-w-md rounded-xl overflow-hidden",
            "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"
        )}>
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
                </div>
            </div>
        </div>
    );
}

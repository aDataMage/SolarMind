import { Zap, Battery, Cpu, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appliance {
    name: string;
    watts: number;
    count: number;
    total: number;
}

interface PowerAnalysisProps {
    appliances: Appliance[];
    totalLoad: number;
    peakLoad: number;
    recommendedInverter: {
        size: string;
        reason: string;
    };
    recommendedBattery: {
        capacity: string;
        count: number;
        voltage: string;
        backupTime: string;
        reason: string;
    };
    recommendedPanels?: {
        count: number;
        capacity: string;
        reason: string;
    };
}

export function PowerAnalysisCard({
    appliances,
    totalLoad,
    peakLoad,
    recommendedInverter,
    recommendedBattery,
    recommendedPanels
}: PowerAnalysisProps) {
    return (
        <div className="w-full max-w-lg rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm my-4">

            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Power Requirement Analysis</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Based on your appliance list</p>
                    </div>
                </div>
            </div>

            {/* Load Breakdown */}
            <div className="p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Load Analysis</h4>
                <div className="space-y-2 mb-4">
                    {appliances.map((app, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-700 dark:text-slate-300">
                                {app.count} × {app.name} <span className="text-slate-400 text-xs">({app.watts}W)</span>
                            </span>
                            <span className="font-medium text-slate-900 dark:text-slate-200">{app.total}W</span>
                        </div>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Total Continuous Load</span>
                        <span className="font-bold text-slate-900 dark:text-white">{totalLoad}W</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Estimated Peak Load (+Surge)</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{peakLoad}W</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6">
                    {/* Inverter Recommendation */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900/50">
                        <div className="flex items-start gap-3">
                            <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <h5 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Recommended Inverter</h5>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{recommendedInverter.size}</p>
                                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">{recommendedInverter.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Battery Recommendation */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/50">
                        <div className="flex items-start gap-3">
                            <Battery className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                            <div>
                                <h5 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">Battery Bank</h5>
                                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                    {recommendedBattery.count} × {recommendedBattery.capacity} <span className="text-sm font-normal">({recommendedBattery.voltage})</span>
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">{recommendedBattery.backupTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solar Recommendation (Optional) */}
                    {recommendedPanels && (
                        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-100 dark:border-orange-900/50">
                            <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                                <div>
                                    <h5 className="font-semibold text-orange-900 dark:text-orange-200 text-sm">Solar Array (Optional)</h5>
                                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{recommendedPanels.count} × {recommendedPanels.capacity}</p>
                                    <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">{recommendedPanels.reason}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

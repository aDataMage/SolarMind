/**
 * Power Calculation Tool for Sales Engineer Agent
 * 
 * Calculates power requirements and battery sizing for solar systems.
 * 
 * Requirements: 2.1, 2.2, 2.5
 */

import { tool } from 'ai';
import { z } from 'zod';

/** Schema for a single appliance input */
const ApplianceSchema = z.object({
  name: z.string().describe('Name of the appliance (e.g., "Refrigerator", "TV")'),
  wattage: z.number().positive().describe('Power consumption in watts'),
  hoursPerDay: z.number().min(0).max(24).describe('Average hours of use per day'),
});

/** Schema for power calculation parameters */
export const PowerCalculationParamsSchema = z.object({
  appliances: z.array(ApplianceSchema).min(1).describe('List of appliances to power'),
  backupHours: z.number().positive().describe('Desired backup hours during power outage'),
  batteryEfficiency: z.number().min(0.1).max(1).default(0.85).describe('Battery efficiency factor (default 0.85 or 85%)'),
});

export type PowerCalculationParams = z.infer<typeof PowerCalculationParamsSchema>;

/** Individual appliance calculation result */
export interface ApplianceCalculation {
  name: string;
  wattage: number;
  hoursPerDay: number;
  dailyWattHours: number;
}

/** Complete power calculation result */
export interface PowerCalculationResult {
  appliances: ApplianceCalculation[];
  totalWattage: number;
  totalDailyWattHours: number;
  backupHours: number;
  batteryEfficiency: number;
  requiredBatteryCapacityWh: number;
  requiredBatteryCapacityKwh: number;
  recommendedInverterWatts: number;
  breakdown: string;
}

/**
 * Calculates power requirements for a set of appliances
 * 
 * Formula:
 * - Daily Watt-Hours = sum of (appliance_wattage × hours_per_day)
 * - Battery Capacity = (total_wattage × backup_hours) / efficiency
 * - Recommended Inverter = total_wattage × 1.25 (25% safety margin)
 * 
 * @param params - Appliances, backup hours, and efficiency
 * @returns Detailed calculation breakdown
 */
export function calculatePowerRequirements(params: PowerCalculationParams): PowerCalculationResult {
  const { appliances, backupHours, batteryEfficiency } = params;

  // Calculate per-appliance consumption
  const applianceCalculations: ApplianceCalculation[] = appliances.map(appliance => ({
    name: appliance.name,
    wattage: appliance.wattage,
    hoursPerDay: appliance.hoursPerDay,
    dailyWattHours: appliance.wattage * appliance.hoursPerDay,
  }));

  // Sum total wattage (peak load)
  const totalWattage = appliances.reduce((sum, a) => sum + a.wattage, 0);

  // Sum total daily consumption
  const totalDailyWattHours = applianceCalculations.reduce((sum, a) => sum + a.dailyWattHours, 0);

  // Calculate battery capacity needed for backup
  // Formula: (total_wattage × backup_hours) / efficiency
  const requiredBatteryCapacityWh = (totalWattage * backupHours) / batteryEfficiency;
  const requiredBatteryCapacityKwh = requiredBatteryCapacityWh / 1000;

  // Recommended inverter with 25% safety margin
  const recommendedInverterWatts = Math.ceil(totalWattage * 1.25);

  // Generate human-readable breakdown
  const breakdown = generateBreakdown({
    applianceCalculations,
    totalWattage,
    totalDailyWattHours,
    backupHours,
    batteryEfficiency,
    requiredBatteryCapacityWh,
    requiredBatteryCapacityKwh,
    recommendedInverterWatts,
  });

  return {
    appliances: applianceCalculations,
    totalWattage,
    totalDailyWattHours,
    backupHours,
    batteryEfficiency,
    requiredBatteryCapacityWh,
    requiredBatteryCapacityKwh,
    recommendedInverterWatts,
    breakdown,
  };
}

/**
 * Generates a human-readable breakdown of the calculation
 */
function generateBreakdown(data: {
  applianceCalculations: ApplianceCalculation[];
  totalWattage: number;
  totalDailyWattHours: number;
  backupHours: number;
  batteryEfficiency: number;
  requiredBatteryCapacityWh: number;
  requiredBatteryCapacityKwh: number;
  recommendedInverterWatts: number;
}): string {
  const lines: string[] = [
    '## Power Calculation Breakdown\n',
    '### Appliance Analysis',
  ];

  for (const appliance of data.applianceCalculations) {
    lines.push(
      `- **${appliance.name}**: ${appliance.wattage}W × ${appliance.hoursPerDay}h/day = ${appliance.dailyWattHours}Wh/day`
    );
  }

  lines.push(
    '',
    '### Summary',
    `- **Total Peak Load**: ${data.totalWattage}W`,
    `- **Daily Energy Consumption**: ${data.totalDailyWattHours}Wh (${(data.totalDailyWattHours / 1000).toFixed(2)}kWh)`,
    '',
    '### Battery Sizing',
    `- **Backup Duration**: ${data.backupHours} hours`,
    `- **Battery Efficiency**: ${(data.batteryEfficiency * 100).toFixed(0)}%`,
    `- **Required Battery Capacity**: ${data.requiredBatteryCapacityWh.toFixed(0)}Wh (${data.requiredBatteryCapacityKwh.toFixed(2)}kWh)`,
    `- **Calculation**: (${data.totalWattage}W × ${data.backupHours}h) ÷ ${data.batteryEfficiency} = ${data.requiredBatteryCapacityWh.toFixed(0)}Wh`,
    '',
    '### Inverter Recommendation',
    `- **Recommended Inverter Size**: ${data.recommendedInverterWatts}W (includes 25% safety margin)`,
  );

  return lines.join('\n');
}

/**
 * Vercel AI SDK tool definition for power calculation
 */
export const calculatorTool = tool({
  description: 'Calculate power requirements and battery sizing for solar systems based on appliances and backup needs',
  inputSchema: PowerCalculationParamsSchema,
  execute: async (params: PowerCalculationParams) => calculatePowerRequirements(params),
});

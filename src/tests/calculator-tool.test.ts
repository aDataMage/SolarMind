/**
 * Tests for Power Calculation Tool
 * 
 * Validates: Requirements 2.1, 2.2, 2.5
 * Feature: solar-multi-agent-assistant
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePowerRequirements,
  type PowerCalculationParams,
} from '@/lib/infrastructure/ai/tools/calculator-tool';

describe('Calculator Tool - Power Requirements', () => {
  describe('calculatePowerRequirements', () => {
    it('should calculate total wattage correctly for single appliance', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'Refrigerator', wattage: 150, hoursPerDay: 24 },
        ],
        backupHours: 8,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      expect(result.totalWattage).toBe(150);
      expect(result.totalDailyWattHours).toBe(3600); // 150W * 24h
    });

    it('should calculate total wattage correctly for multiple appliances', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'Refrigerator', wattage: 150, hoursPerDay: 24 },
          { name: 'TV', wattage: 100, hoursPerDay: 6 },
          { name: 'Fan', wattage: 75, hoursPerDay: 12 },
        ],
        backupHours: 8,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      // Total wattage = 150 + 100 + 75 = 325W
      expect(result.totalWattage).toBe(325);
      
      // Daily Wh = (150*24) + (100*6) + (75*12) = 3600 + 600 + 900 = 5100Wh
      expect(result.totalDailyWattHours).toBe(5100);
    });

    it('should calculate battery capacity with efficiency factor', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'Refrigerator', wattage: 200, hoursPerDay: 24 },
        ],
        backupHours: 10,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      // Battery capacity = (totalWattage * backupHours) / efficiency
      // = (200 * 10) / 0.85 = 2352.94Wh
      const expectedCapacity = (200 * 10) / 0.85;
      expect(result.requiredBatteryCapacityWh).toBeCloseTo(expectedCapacity, 2);
      expect(result.requiredBatteryCapacityKwh).toBeCloseTo(expectedCapacity / 1000, 2);
    });

    it('should recommend inverter with 25% safety margin', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'AC', wattage: 1000, hoursPerDay: 8 },
          { name: 'Fridge', wattage: 200, hoursPerDay: 24 },
        ],
        backupHours: 6,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      // Total wattage = 1000 + 200 = 1200W
      // Recommended inverter = 1200 * 1.25 = 1500W
      expect(result.totalWattage).toBe(1200);
      expect(result.recommendedInverterWatts).toBe(1500);
    });

    it('should use default battery efficiency of 0.85', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'Light', wattage: 50, hoursPerDay: 6 },
        ],
        backupHours: 4,
        batteryEfficiency: 0.85, // Default value
      };

      const result = calculatePowerRequirements(params);

      expect(result.batteryEfficiency).toBe(0.85);
    });

    it('should include breakdown string with calculation details', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'TV', wattage: 100, hoursPerDay: 5 },
        ],
        backupHours: 6,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      expect(result.breakdown).toContain('Power Calculation Breakdown');
      expect(result.breakdown).toContain('TV');
      expect(result.breakdown).toContain('100W');
      expect(result.breakdown).toContain('Battery Sizing');
      expect(result.breakdown).toContain('Inverter Recommendation');
    });

    it('should return appliance-level calculations', () => {
      const params: PowerCalculationParams = {
        appliances: [
          { name: 'Fridge', wattage: 150, hoursPerDay: 24 },
          { name: 'TV', wattage: 80, hoursPerDay: 4 },
        ],
        backupHours: 8,
        batteryEfficiency: 0.85,
      };

      const result = calculatePowerRequirements(params);

      expect(result.appliances).toHaveLength(2);
      expect(result.appliances[0]).toEqual({
        name: 'Fridge',
        wattage: 150,
        hoursPerDay: 24,
        dailyWattHours: 3600,
      });
      expect(result.appliances[1]).toEqual({
        name: 'TV',
        wattage: 80,
        hoursPerDay: 4,
        dailyWattHours: 320,
      });
    });
  });
});

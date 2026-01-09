/**
 * Tests for Customer Success Agent
 * 
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 6.2
 * Feature: solar-multi-agent-assistant
 */

import { describe, it, expect } from 'vitest';
import { isTechnicalQuery } from '@/lib/infrastructure/ai/agents/customer-success-agent';

describe('Customer Success Agent', () => {
  describe('isTechnicalQuery', () => {
    it('should identify wattage questions as technical', () => {
      expect(isTechnicalQuery('How many watts do I need?')).toBe(true);
      expect(isTechnicalQuery('What is the wattage of this inverter?')).toBe(true);
    });

    it('should identify battery questions as technical', () => {
      expect(isTechnicalQuery('What battery size do I need?')).toBe(true);
      expect(isTechnicalQuery('How long will the battery last?')).toBe(true);
    });

    it('should identify inverter questions as technical', () => {
      expect(isTechnicalQuery('Which inverter should I buy?')).toBe(true);
      expect(isTechnicalQuery('Is a 3kVA inverter enough?')).toBe(true);
    });

    it('should identify solar panel questions as technical', () => {
      expect(isTechnicalQuery('How many panels do I need?')).toBe(true);
      expect(isTechnicalQuery('What panel capacity is best?')).toBe(true);
    });

    it('should identify calculation questions as technical', () => {
      expect(isTechnicalQuery('Can you calculate my power needs?')).toBe(true);
      expect(isTechnicalQuery('Help me with sizing my solar system')).toBe(true);
    });

    it('should identify power consumption questions as technical', () => {
      expect(isTechnicalQuery('What is the power consumption of a fridge?')).toBe(true);
      expect(isTechnicalQuery('How much load can this handle?')).toBe(true);
    });

    it('should identify appliance-related questions as technical', () => {
      expect(isTechnicalQuery('Can this power my appliances?')).toBe(true);
      expect(isTechnicalQuery('What appliances can I run?')).toBe(true);
    });

    it('should NOT identify policy questions as technical', () => {
      expect(isTechnicalQuery('What is your warranty policy?')).toBe(false);
      expect(isTechnicalQuery('Can I return this product?')).toBe(false);
    });

    it('should NOT identify location questions as technical', () => {
      expect(isTechnicalQuery('Where is your shop in Lagos?')).toBe(false);
      expect(isTechnicalQuery('What are your opening hours?')).toBe(false);
    });

    it('should NOT identify general greetings as technical', () => {
      expect(isTechnicalQuery('Hello, how are you?')).toBe(false);
      expect(isTechnicalQuery('Good morning!')).toBe(false);
      expect(isTechnicalQuery('Thank you for your help')).toBe(false);
    });

    it('should NOT identify pricing questions without technical terms as technical', () => {
      expect(isTechnicalQuery('How much does this cost?')).toBe(false);
      expect(isTechnicalQuery('What are your prices?')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isTechnicalQuery('WHAT BATTERY DO I NEED?')).toBe(true);
      expect(isTechnicalQuery('Calculate my POWER needs')).toBe(true);
      expect(isTechnicalQuery('KW requirements')).toBe(true);
    });

    it('should identify kW and kWh terms as technical', () => {
      expect(isTechnicalQuery('I need a 5kW system')).toBe(true);
      expect(isTechnicalQuery('How many kWh per day?')).toBe(true);
    });

    it('should identify backup-related questions as technical', () => {
      expect(isTechnicalQuery('How long is the backup time?')).toBe(true);
      expect(isTechnicalQuery('I need 8 hours backup')).toBe(true);
    });
  });
});

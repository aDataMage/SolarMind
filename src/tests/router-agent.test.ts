/**
 * Tests for Router Agent
 * 
 * Validates: Requirements 1.1, 1.2, 1.4, 1.5
 * Feature: solar-multi-agent-assistant
 */

import { describe, it, expect } from 'vitest';
import { getAgentsForIntents } from '@/lib/infrastructure/ai/agents/router-agent';
import type { Intent } from '@/lib/domain/models/message';

describe('Router Agent', () => {
  describe('getAgentsForIntents', () => {
    it('should route technical_sizing intent to sales_engineer', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.9 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('sales_engineer');
      expect(agents).not.toContain('customer_success');
    });

    it('should route support_inquiry intent to customer_success', () => {
      const intents: Intent[] = [
        { type: 'support_inquiry', confidence: 0.85 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('customer_success');
      expect(agents).not.toContain('sales_engineer');
    });

    it('should route general intent to customer_success', () => {
      const intents: Intent[] = [
        { type: 'general', confidence: 0.8 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('customer_success');
    });

    it('should route multi-intent messages to multiple agents', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.85 },
        { type: 'support_inquiry', confidence: 0.75 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('sales_engineer');
      expect(agents).toContain('customer_success');
      expect(agents).toHaveLength(2);
    });

    it('should ignore intents with confidence below 0.5', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.4 },
        { type: 'support_inquiry', confidence: 0.8 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('customer_success');
      expect(agents).not.toContain('sales_engineer');
    });

    it('should default to customer_success when no valid intents', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.3 },
        { type: 'support_inquiry', confidence: 0.2 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('customer_success');
      expect(agents).toHaveLength(1);
    });

    it('should default to customer_success for empty intents array', () => {
      const intents: Intent[] = [];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('customer_success');
      expect(agents).toHaveLength(1);
    });

    it('should not duplicate agents for multiple intents of same type', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.9 },
        { type: 'technical_sizing', confidence: 0.7 },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('sales_engineer');
      expect(agents).toHaveLength(1);
    });

    it('should handle intents with extracted entities', () => {
      const intents: Intent[] = [
        {
          type: 'technical_sizing',
          confidence: 0.9,
          extractedEntities: {
            appliances: ['refrigerator', 'TV'],
          },
        },
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('sales_engineer');
    });

    it('should handle mixed confidence levels correctly', () => {
      const intents: Intent[] = [
        { type: 'technical_sizing', confidence: 0.6 }, // Above 0.5 threshold
        { type: 'support_inquiry', confidence: 0.4 }, // Below 0.5 threshold
        { type: 'general', confidence: 0.55 }, // Above 0.5 threshold
      ];

      const agents = getAgentsForIntents(intents);

      expect(agents).toContain('sales_engineer');
      expect(agents).toContain('customer_success'); // From general intent
      expect(agents).toHaveLength(2);
    });
  });
});

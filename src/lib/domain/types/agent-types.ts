/**
 * Shared types and schemas for AI agents.
 * Requirements: 1.3
 */

import { z } from 'zod';
import { Message } from '../models/message';

// --- Zod Schemas ---

export const AgentActionSchema = z.object({
    toolName: z.string(),
    parameters: z.record(z.string(), z.any()),
    thoughtProcess: z.string().optional(),
});

export const AgentResponseSchema = z.object({
    content: z.string(),
    actions: z.array(AgentActionSchema).optional(),
    confidence: z.number().optional(),
});

// --- Types ---

export interface AgentInput {
    messages: Message[];
    context?: Record<string, any>;
}

export interface AgentOutput {
    messages: Message[];
    metadata?: Record<string, any>;
}

export interface ToolResult {
    toolName: string;
    result: any;
    error?: string;
}

import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

export async function classifyIntent(message: string) {
    return await generateObject({
        model: openai('gpt-4o-mini'),
        schema: z.object({
            intent: z.enum(['booking', 'knowledge', 'service', 'general']),
            confidence: z.number(),
        }),
        prompt: `Classify this message: "${message}"`
    });
}

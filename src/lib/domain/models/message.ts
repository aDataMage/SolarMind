/**
 * Message and Intent domain models for the multi-agent assistant system.
 * Requirements: 1.1, 1.2, 4.1
 */

/** Role types for conversation participants */
export type MessageRole = 'user' | 'assistant' | 'system';

/** Intent types for message classification */
export type IntentType = 'technical_sizing' | 'support_inquiry' | 'general';

/** Agent source identifiers */
export type AgentSource = 'router' | 'sales_engineer' | 'customer_success';

/** Extracted entities from user messages */
export interface ExtractedEntities {
  /** Appliances mentioned in technical queries */
  appliances?: string[];
  /** Location mentioned for shop/service queries */
  location?: string;
  /** General topic of the query */
  topic?: string;
}

/** Intent classification result */
export interface Intent {
  /** The classified intent type */
  type: IntentType;
  /** Confidence score between 0 and 1 */
  confidence: number;
  /** Entities extracted from the message */
  extractedEntities?: ExtractedEntities;
}

/** Metadata attached to messages */
export interface MessageMetadata {
  /** Which agent generated this message */
  agentSource?: AgentSource;
  /** Intents detected in the message */
  intents?: Intent[];
  /** Time taken to process the message in milliseconds */
  processingTimeMs?: number;
}

/** A message in the conversation */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Content of the message */
  content: string;
  /** When the message was created */
  timestamp: Date;
  /** Optional metadata about the message */
  metadata?: MessageMetadata;
}

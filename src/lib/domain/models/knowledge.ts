/**
 * Knowledge domain models for RAG system.
 * Requirements: 1.2, 3.1
 */

export type KnowledgeCategory = 'policy' | 'product' | 'location' | 'general' | 'faq';

export interface KnowledgeChunk {
    id: string;
    /** The actual text content used for RAG */
    content: string;
    /** Source document this chunk came from */
    source: string;
    /** Category of knowledge */
    category: KnowledgeCategory;
    /** Vector embedding of the content */
    embedding?: number[];
    /** Relevance score from search results */
    score?: number;
    /** Additional metadata */
    metadata?: Record<string, any>;
}

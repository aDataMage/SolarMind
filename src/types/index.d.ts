declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            OPENAI_API_KEY: string;
            QDRANT_URL: string;
            QDRANT_API_KEY: string;
        }
    }
}

export { };

import { pgTable, varchar, text, decimal, jsonb, real } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: varchar('id').primaryKey(),
    slug: varchar('slug').unique().notNull(),
    name: varchar('name').notNull(),
    description: text('description').notNull(),
    price: decimal('price').notNull(),
    category: varchar('category').notNull(), // 'panels' | 'batteries' etc
    rating: real('rating').default(0),
    image: text('image'),
    specs: jsonb('specs'), // Flexible JSON for technical specs
});

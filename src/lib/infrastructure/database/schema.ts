import { pgTable, varchar, decimal, jsonb } from 'drizzle-orm/pg-core';

// Easy to swap 'rooms' for 'properties' or 'products'
export const rooms = pgTable('rooms', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull(),
    price: decimal('price').notNull(),
    features: jsonb('features'), // Flexible JSON for varied attributes
});

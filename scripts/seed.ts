import { db } from '../src/lib/infrastructure/database/db';
import { rooms } from '../src/lib/infrastructure/database/schema';
// import { faker } from '@faker-js/faker';

async function main() {
    console.log('Seeding Database...');
    // await db.insert(rooms).values([...]);
    console.log('Database seeded!');
}

main().catch(console.error);

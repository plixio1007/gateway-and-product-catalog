import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log('🌱 Mulai seeding database...');

	const admin = await prisma.user.upsert({
		where: { email: 'admin@plixio.com' },
		update: {},
		create: {
			email: 'admin@plixio.com',
			password: 'hashed_password_123',
			profile: {
				create: {
					firstName: 'Super',
					lastName: 'Admin',
				},
			},
		},
	});

	console.log('✅ admin created:', admin.email);
}

main()
	.catch((e) => {
		console.error('❌ seeding failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

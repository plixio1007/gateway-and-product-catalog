import 'dotenv/config';

import { AuctionStatus, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log('🌱 Mulai seeding database...');

	await prisma.product.deleteMany();
	console.log('🧹 Existing products cleared');

	const categories = [
		'Vintage Camera',
		'Gaming Console',
		'Mechanical Keyboard',
		'Smart Watch',
		'Limited Sneaker',
		'Bluetooth Speaker',
		'Designer Handbag',
		'Collectible Figure',
		'Mountain Bike',
		'Noise Cancelling Headphones',
	];

	const adjectives = [
		'Premium',
		'Exclusive',
		'Collector Edition',
		'Refurbished',
		'Like New',
	];

	const products = Array.from({ length: 50 }, (_, index) => {
		const category = categories[index % categories.length];
		const adjective = adjectives[index % adjectives.length];
		const productNumber = index + 1;
		const status: AuctionStatus =
			productNumber % 10 === 0
				? AuctionStatus.CLOSED
				: productNumber % 4 === 0
					? AuctionStatus.SOLD
					: AuctionStatus.ACTIVE;
		const price = Number((49 + productNumber * 7.35).toFixed(2));

		return {
			name: `${adjective} ${category} #${productNumber}`,
			description: `${category} with complete accessories, tested quality, and ready for auction simulation.`,
			price,
			status,
		};
	});

	await prisma.product.createMany({
		data: products,
	});
	console.log(`✅ ${products.length} sample products created`);

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

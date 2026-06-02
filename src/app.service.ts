import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
	constructor(private readonly prisma: PrismaService) {}
	async HealthCheck() {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return { status: 'up', database: 'connected' };
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'unexpected error';
			return { status: 'down', database: 'disconected', error: errorMsg };
		}
	}
}

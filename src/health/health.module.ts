import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma/prisma.modules';

@Module({
	imports: [TerminusModule, PrismaModule],
	controllers: [HealthController],
})
export class HealthModule {}

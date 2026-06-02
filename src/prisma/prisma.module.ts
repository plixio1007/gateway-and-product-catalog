import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Ini magic-nya biar bisa di-inject ke module manapun!
@Module({
	providers: [PrismaService],
	exports: [PrismaService], // Wajib diexport
})
export class PrismaModule {}

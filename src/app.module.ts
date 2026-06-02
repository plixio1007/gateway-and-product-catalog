import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import minioConfig from '@config/minio.config';
import { envValidationSchema } from '@config/env.validation';
import { PrismaModule } from './prisma/prisma.modules';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [databaseConfig, jwtConfig, minioConfig],
			validationSchema: envValidationSchema,
			validationOptions: {
				abortEarly: false,
			},
		}),
		PrismaModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import minioConfig from '@config/minio.config';
import { envValidationSchema } from '@config/env.validation';
import { PrismaModule } from './prisma/prisma.modules';
import { HealthModule } from './health/health.module';
import { ProductModule } from '@modules/product/product.module';

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
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			sortSchema: true,
		}),
		PrismaModule,
		HealthModule,
		ProductModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { MockEnvironmentGuard } from './guards/mock-environment.guard';

@Module({
	providers: [ProductResolver, ProductService, MockEnvironmentGuard],
})
export class ProductModule {}

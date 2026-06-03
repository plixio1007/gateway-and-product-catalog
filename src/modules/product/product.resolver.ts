import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { MockAuctionStateTransitionInput } from './dto/mock-auction-state-transition.input';
import { MockEnvironmentGuard } from './guards/mock-environment.guard';

@Resolver(() => ProductEntity)
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Mutation(() => ProductEntity)
	@UseGuards(MockEnvironmentGuard)
	async mockAuctionStateTransition(
		@Args('input') input: MockAuctionStateTransitionInput,
	): Promise<ProductEntity> {
		return this.productService.mockAuctionStateTransition(
			input.productId,
			input.status,
		);
	}
}

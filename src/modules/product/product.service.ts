import {
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { AuctionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
	private readonly logger = new Logger(ProductService.name);

	constructor(private readonly prisma: PrismaService) {}

	async mockAuctionStateTransition(
		productId: string,
		status: AuctionStatus,
	): Promise<ProductEntity> {
		const existingProduct = await this.prisma.product.findUnique({
			where: { id: productId },
		});

		if (!existingProduct) {
			throw new NotFoundException(`Product with id ${productId} was not found`);
		}

		const updatedProduct = await this.prisma.product.update({
			where: { id: productId },
			data: { status },
		});

		this.logger.log(
			`Mock auction state transition: product=${productId}, from=${existingProduct.status}, to=${status}`,
		);

		return {
			...updatedProduct,
			price: Number(updatedProduct.price),
		};
	}
}

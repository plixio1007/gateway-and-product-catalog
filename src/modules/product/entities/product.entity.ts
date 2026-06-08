import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AuctionStatus } from '@prisma/client';

registerEnumType(AuctionStatus, {
	name: 'AuctionStatus',
});

@ObjectType('Product')
export class ProductEntity {
	@Field()
	id: string;

	@Field()
	name: string;

	@Field()
	description: string;

	@Field(() => Float)
	price: number;

	@Field(() => AuctionStatus)
	status: AuctionStatus;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;
}

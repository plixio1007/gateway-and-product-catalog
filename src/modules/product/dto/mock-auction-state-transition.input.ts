import { Field, InputType } from '@nestjs/graphql';
import { AuctionStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

@InputType()
export class MockAuctionStateTransitionInput {
	@Field()
	@IsUUID()
	productId: string;

	@Field(() => AuctionStatus)
	@IsEnum(AuctionStatus)
	status: AuctionStatus;
}

import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MockEnvironmentGuard implements CanActivate {
	private readonly logger = new Logger(MockEnvironmentGuard.name);

	constructor(private readonly configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const contextType = context.getType<string>();
		if (contextType !== 'graphql') {
			this.logger.warn(`Rejected non-GraphQL context type: ${contextType}`);
			throw new ForbiddenException(
				'Mocking mutations are only available via GraphQL',
			);
		}

		const environment =
			this.configService.get<string>('NODE_ENV') ?? 'development';

		if (environment === 'development' || environment === 'staging') {
			return true;
		}

		if (environment === 'production') {
			throw new ForbiddenException(
				'Mocking mutations are not allowed in production',
			);
		}

		throw new ForbiddenException(
			`Mocking mutations are not allowed in '${environment}' environment`,
		);
	}
}

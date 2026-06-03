import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MockEnvironmentGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		void context;
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
			'Mocking mutations are only allowed in development or staging environments',
		);
	}
}

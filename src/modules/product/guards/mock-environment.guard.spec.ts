import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockEnvironmentGuard } from './mock-environment.guard';

describe('MockEnvironmentGuard', () => {
	const createGuard = (nodeEnv: string) => {
		const configService = {
			get: jest.fn().mockReturnValue(nodeEnv),
		} as unknown as ConfigService;

		return new MockEnvironmentGuard(configService);
	};
	const graphqlContext = { getType: jest.fn().mockReturnValue('graphql') };

	it('allows mocking mutation in development', () => {
		const guard = createGuard('development');

		expect(guard.canActivate(graphqlContext as never)).toBe(true);
	});

	it('allows mocking mutation in staging', () => {
		const guard = createGuard('staging');

		expect(guard.canActivate(graphqlContext as never)).toBe(true);
	});

	it('throws 403 for production', () => {
		const guard = createGuard('production');

		expect(() => guard.canActivate(graphqlContext as never)).toThrow(
			ForbiddenException,
		);
		expect(() => guard.canActivate(graphqlContext as never)).toThrow(
			'Mocking mutations are not allowed in production',
		);
	});

	it('throws 403 for unsupported environment', () => {
		const guard = createGuard('test');

		expect(() => guard.canActivate(graphqlContext as never)).toThrow(
			ForbiddenException,
		);
		expect(() => guard.canActivate(graphqlContext as never)).toThrow(
			"Mocking mutations are not allowed in 'test' environment",
		);
	});
});

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

	it('allows mocking mutation in development', () => {
		const guard = createGuard('development');

		expect(guard.canActivate({} as never)).toBe(true);
	});

	it('allows mocking mutation in staging', () => {
		const guard = createGuard('staging');

		expect(guard.canActivate({} as never)).toBe(true);
	});

	it('throws 403 for production', () => {
		const guard = createGuard('production');

		expect(() => guard.canActivate({} as never)).toThrow(ForbiddenException);
		expect(() => guard.canActivate({} as never)).toThrow(
			'Mocking mutations are not allowed in production',
		);
	});
});

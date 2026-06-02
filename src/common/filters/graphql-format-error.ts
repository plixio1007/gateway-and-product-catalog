import { GraphQLError, GraphQLFormattedError } from 'graphql';

const isProduction = process.env.NODE_ENV === 'production';

export function formatGraphQLError(
	formattedError: GraphQLFormattedError,
	originalError: unknown,
): GraphQLFormattedError {
	const statusCode = extractStatusCode(originalError);
	const errorName = extractErrorName(originalError);

	return {
		message: sanitizeMessage(formattedError.message, statusCode),
		locations: formattedError.locations,
		path: formattedError.path,
		extensions: {
			statusCode,
			error: errorName,
			timestamp: new Date().toISOString(),
			...(isProduction
				? {}
				: { stacktrace: formattedError.extensions?.stacktrace }),
		},
	};
}

function extractStatusCode(error: unknown): number {
	if (error instanceof Error) {
		interface WithGetStatus {
			getStatus(): number;
		}
		if (
			'getStatus' in error &&
			typeof (error as unknown as WithGetStatus).getStatus === 'function'
		) {
			return (error as unknown as WithGetStatus).getStatus();
		}

		if (error instanceof GraphQLError && error.extensions?.code) {
			return graphqlCodeToHttpStatus(error.extensions.code as string);
		}
	}

	return 500;
}

function extractErrorName(error: unknown): string {
	if (error instanceof Error) {
		if ('name' in error && error.name !== 'Error') {
			return error.name;
		}
	}
	return 'Internal Server Error';
}

function sanitizeMessage(message: string, statusCode: number): string {
	if (!isProduction) return message;
	if (statusCode >= 500) return 'Internal server error';
	return message;
}

function graphqlCodeToHttpStatus(code: string): number {
	const map: Record<string, number> = {
		UNAUTHENTICATED: 401,
		FORBIDDEN: 403,
		BAD_USER_INPUT: 400,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
		GRAPHQL_VALIDATION_FAILED: 400,
		PERSISTED_QUERY_NOT_FOUND: 404,
	};
	return map[code] ?? 500;
}

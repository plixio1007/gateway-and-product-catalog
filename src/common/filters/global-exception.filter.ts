import {
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { error } from 'node:console';

export interface ErrorResponse {
	statusCode: number;
	message: string | string[];
	error: string;
	timestamp: string;
	path: string;
}

export class GlobalExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);
	private readonly isProduction = process.env.NODE_ENV === 'production';
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const contextType = host.getType<'http' | 'graphql'>();
		if (contextType === 'graphql') {
			this.logException(exception, 'graphql');
		} else {
			this.handleHttpException(exception, host);
		}
	}

	private extractErrorDetails(exception: unknown): {
		statusCode: number;
		message: string | string[];
		error: string;
	} {
		if (exception instanceof HttpException) {
			const statusCode = exception.getStatus();
			const response = exception.getResponse();

			if (typeof response == 'string') {
				return {
					statusCode: statusCode,
					message: response,
					error: '',
				};
			} else if (typeof response == 'object' && error !== null) {
				const res = response as Record<string, unknown>;
				return {
					statusCode: statusCode,
					message: (res.message as string | string[]) ?? exception.message,
					error: (res.error as string) ?? exception.name,
				};
			}
		}

		if (exception instanceof Error) {
			return {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: this.isProduction
					? 'Internal server error'
					: exception.message,
				error: 'Internal Server Error',
			};
		}

		return {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal server error',
			error: 'Internal Server Error',
		};
	}

	private handleHttpException(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();

		const { statusCode, message, error } = this.extractErrorDetails(exception);
		const respBody: ErrorResponse = {
			statusCode: statusCode,
			message: message,
			error: error,
			timestamp: new Date().toISOString(),
			path: request.url,
		};

		this.logException(exception, 'HTTP', request.url);
		httpAdapter.reply(ctx.getResponse(), respBody, statusCode);
	}

	private logException(
		exception: unknown,
		context: string,
		path?: string,
	): void {
		const prefix = path ? `[${context}] ${path}` : `[${context}]`;

		if (exception instanceof HttpException) {
			if (exception.getStatus() < 500) {
				this.logger.warn(`${prefix} ${exception.message}`);
			} else {
				this.logger.error(`${prefix} ${exception.message}`, exception.stack);
			}
			return;
		}

		if (exception instanceof Error) {
			this.logger.error(`${prefix} ${exception.message}`, exception.stack);
			return;
		}

		this.logger.error(`${prefix} Unknown exception`, String(exception));
	}
}

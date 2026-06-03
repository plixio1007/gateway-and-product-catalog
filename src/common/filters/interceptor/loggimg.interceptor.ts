import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const requestID = crypto.randomUUID();

		response.setHeader('X-REQUEST-ID', requestID);

		const method = request.method;
		const url = request.url;
		const startTime = Date.now();

		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - startTime;
				const statusCode = response.statusCode;

				const logData = {
					level: 'info',
					timestamp: new Date().toISOString(),
					requestId: requestID,
					method: method,
					url: url,
					statusCode: statusCode,
					responseTimeMs: responseTime,
				};
				console.log(JSON.stringify(logData));
			}),
		);
	}
}

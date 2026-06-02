import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
	constructor(private readonly service: AppService) {}

	@Get()
	async getHealth() {
		return await this.service.HealthCheck();
	}
}

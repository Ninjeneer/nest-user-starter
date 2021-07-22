import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import SwaggerDocumentation from './swagger';
import config from './assets/config.json';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	const swaggerDoc = new SwaggerDocumentation(app);
	swaggerDoc.serve();

	await app.listen(config.server.port);
}
bootstrap();

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import SwaggerDocumentation from './swagger';
import { ValidationPipe } from '@nestjs/common';
import config from './assets/config.json';
import { fastifyHelmet } from 'fastify-helmet';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { cors: true });
	await app.register(fastifyHelmet);
	app.useGlobalPipes(new ValidationPipe());

	const swaggerDoc = new SwaggerDocumentation(app);
	swaggerDoc.serve();

	await app.listen(config.server.port);
}
bootstrap();

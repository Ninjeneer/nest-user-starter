import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import config from './assets/config.json';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	// Configure swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Swagger starter')
		.setDescription('NestJS web-server starter kit API')
		.setVersion('1.0')
		.addTag('users')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, swaggerDocument);

	await app.listen(config.server.port);
}
bootstrap();

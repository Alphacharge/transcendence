import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
	const	httpsOptions = {
		key: fs.readFileSync('/backend/backend.key'),
		cert: fs.readFileSync('/backend/backend.cert'),
	}

	const app = await NestFactory.create(AppModule, {
		httpsOptions,
	});

	app.enableCors({
		origin: 'https://localhost:8080',
	});

	const server = https.createServer(httpsOptions, app.getHttpServer());

  await app.listen(3000);
}
bootstrap();

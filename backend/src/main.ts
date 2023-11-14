import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: `http://${process.env.VUE_APP_BACKEND_IP}:8080/`,
  });

  await app.listen(3000);
}
bootstrap();

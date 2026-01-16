import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.NODE_ENV !== 'production') {
    const swaggerDocument = YAML.load(
      join(__dirname, '..', 'swagger', 'api.yaml'),
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(
      `Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/api-docs`,
    );
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();

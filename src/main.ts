import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // localhost:3000/api

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen( port );
}
bootstrap();
//docker-compose up -d
//docker-compose -f docker-compose.prod.yml build
//docker-compose -f docker-compose.prod.yml up

//docker buildx build --platform linux/amd64,linux/arm64 -t dav1dlynn/pharmaceutical-distribution --push .

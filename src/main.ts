// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      //forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Good practice to include
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API Documentation for the Portfolio Backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api`);
}

// Handle potential errors during bootstrap
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1); // Exit with a failure code
});

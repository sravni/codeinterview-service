import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.disable('x-powered-by');
  app.enableShutdownHooks();

  const configService: ConfigService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Code interview service')
    .setDescription('Code interview service API description')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    {
      useGlobalPrefix: true,
    },
  );

  await app.listen(configService.get('PORT') || 3000, 'localhost');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

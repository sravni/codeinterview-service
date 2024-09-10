import {
  INestApplication,
  ModuleMetadata,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

export async function bootstrapE2ETest(
  metadata: ModuleMetadata,
): Promise<INestApplication> {
  const createTestingModule: TestingModuleBuilder =
    Test.createTestingModule(metadata);
  const moduleRef: TestingModule = await createTestingModule.compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.disable('x-powered-by');

  return app;
}

import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../src/app.module';
import { TypeOrmConfigService } from '../../src/database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export async function beforeAllUtil(): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
  configService: ConfigService;
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
        dataSourceFactory: async (options) => {
          const dataSource = await new DataSource(options).initialize();
          return dataSource;
        },
      }),
    ],
  }).compile();

  const app = moduleFixture.createNestApplication({ logger: false });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  await app.init();

  return { app, moduleFixture, configService };
}

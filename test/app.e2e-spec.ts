import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import {
  appConfig,
  authConfig,
  databaseConfig,
  redisConfig,
} from '../src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environments } from '../src/common/enums';
import { envValidator } from '../src/common/utils';

describe('Test App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig, redisConfig, databaseConfig],
          validate: envValidator,
          validationOptions: {
            allowUnknown: false,
            abortEarly: true,
          },
          envFilePath: [
            appConfig().env === Environments.TEST ? '.env.test' : '.env',
          ],
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
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
  });

  it('start', () => {
    expect(1).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });
});

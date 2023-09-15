import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  databaseConfig,
  mailConfig,
  redisConfig,
  swaggerConfig,
} from './config';
import { envValidator } from './common/utils';
import { Environments } from './common/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { CachingModule } from './common/lib/caching';
import { ProductsModule } from './products/products.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        swaggerConfig,
        redisConfig,
        mailConfig,
        databaseConfig,
      ],
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
    CachingModule,
    AuthenticationModule,
    ProductsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

import { registerAs } from '@nestjs/config';
import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE == 'true' ? true : false,
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS) || 100,
  sslEnabled: process.env.DATABASE_SSL_ENABLED == 'true' ? true : false,
  rejectUnauthorized:
    process.env.DATABASE_REJECT_UNAUTHORIZED == 'true' ? true : false,
  ca: process.env.DATABASE_CA,
  key: process.env.DATABASE_KEY,
  cert: process.env.DATABASE_CERT,
  logging: process.env.DATABASE_LOGGING == 'true' ? true : false,
}));

export class DatabaseEnvSchema {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumberString()
  DATABASE_PORT: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsNumberString()
  DATABASE_MAX_CONNECTIONS: string;

  @IsBooleanString()
  DATABASE_SSL_ENABLED: string;

  @IsBooleanString()
  DATABASE_REJECT_UNAUTHORIZED: string;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;

  @IsBooleanString()
  DATABASE_LOGGING: string;
}

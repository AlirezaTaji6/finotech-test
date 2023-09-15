import { registerAs } from '@nestjs/config';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environments } from '../common/enums/environments.enum';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV || Environments.DEVELOP,
  port: parseInt(process.env.APP_PORT) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  hashSaltRounds: parseInt(process.env.HASH_SALT_ROUNDS) || 6,
  domain: process.env.APP_DOMAIN,
}));

export class AppEnvSchema {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  APP_DOMAIN: string;

  @IsNumberString()
  @IsOptional()
  APP_PORT: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsNumberString()
  @IsOptional()
  HASH_SALT_ROUNDS: string;
}

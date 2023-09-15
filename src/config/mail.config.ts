import { registerAs } from '@nestjs/config';
import {
  IsBooleanString,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { appConfig } from './app.config';
import { Environments } from '../common/enums';

export const mailConfig = registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  user: process.env.MAIL_AUTH_USER,
  password: process.env.MAIL_AUTH_PASS,
  secure: process.env.MAIL_SECURE == 'true' ? true : false,
  from: process.env.MAIL_FROM,
}));

export class MailEnvSchema {
  @ValidateIf(() => appConfig().env !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  MAIL_AUTH_USER: string;

  @ValidateIf(() => appConfig().env !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  MAIL_AUTH_PASS: string;

  @ValidateIf(() => appConfig().env !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @ValidateIf(() => appConfig().env !== Environments.TEST)
  @IsBooleanString()
  @IsNotEmpty()
  MAIL_SECURE: string;

  @ValidateIf(() => appConfig().env !== Environments.TEST)
  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;
}

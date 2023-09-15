import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export const authConfig = registerAs('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
}));

export class AuthEnvSchema {
  @IsString()
  @IsNotEmpty()
  AUTH_JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;
}

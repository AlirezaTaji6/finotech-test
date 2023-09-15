import { DatabaseEnvSchema, databaseConfig } from './database.config';
import { SwaggerEnvSchema, swaggerConfig } from './swagger.config';
import { AuthEnvSchema, authConfig } from './auth.config';
import { AppEnvSchema, appConfig } from './app.config';
import { RedisEnvSchema, redisConfig } from './redis.config';
import { multiInheritance } from '../common/utils';
import { MailEnvSchema, mailConfig } from './mail.config';

class EnvironmentSchema {}
multiInheritance(EnvironmentSchema, [
  AuthEnvSchema,
  AppEnvSchema,
  SwaggerEnvSchema,
  DatabaseEnvSchema,
  MailEnvSchema,
  RedisEnvSchema,
]);

export {
  EnvironmentSchema,
  appConfig,
  authConfig,
  swaggerConfig,
  databaseConfig,
  mailConfig,
  redisConfig,
};

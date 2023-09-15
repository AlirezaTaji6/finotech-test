import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentSchema } from '../../config';
import { Class } from '../types';

export function validator(
  schema: Class,
  configuration: Record<string, any>,
): string | Record<string, any> {
  const finalConfig = plainToClass(schema, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    return errors.toString();
  }

  return finalConfig;
}

export function envValidator(configuration: Record<string, unknown>) {
  const result = validator(EnvironmentSchema, configuration);
  if (typeof result === 'string') throw new Error(result);
  return result;
}

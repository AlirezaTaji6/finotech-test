import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    const redisConfig = {
      store: redisStore,
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      ttl: 86400000,
      max: 10000,
      isGlobal: true,
    };

    this.configService.get('redis.password') &&
      (redisConfig['password'] = this.configService.get('redis.password'));

    return redisConfig;
  }
}

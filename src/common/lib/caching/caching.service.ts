import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: string, options: object = null): Promise<any> {
    return await this.cacheManager.set(key, value, options);
  }

  async del(key: string): Promise<void> {
    return await this.cacheManager.del(key);
  }
}

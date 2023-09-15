import { CacheModule, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheConfigService } from './caching-config.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}

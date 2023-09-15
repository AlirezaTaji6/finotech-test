import { redisConfig } from '../../config';

interface RedisKeyResult {
  name: string;
  ttl: number | null;
}

export const RedisKeys = {
  otp: (key: string | number): RedisKeyResult => {
    return {
      name: `phone-number-verification-code:${String(key)}`,
      ttl: redisConfig().otpCodeTtl,
    };
  },
};

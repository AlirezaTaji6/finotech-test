import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationErrors } from './enums';
import { RedisKeys } from '../common/constants/redis-keys.constant';
import { CachingService } from '../common/lib/caching';
import { generateVerificationCode } from '../common/utils';
import { MailService } from '../mail';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private readonly cachingService: CachingService,
  ) {}

  async generateToken(userId: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      id: userId,
    });
    return token;
  }

  async setOtp(email: string): Promise<string> {
    const code = generateVerificationCode();
    const { name, ttl } = RedisKeys.otp(email);
    await this.cachingService.set(name, String(code), { ttl });
    return code;
  }

  async isOtpCorrect(email: string, code: string) {
    const { name } = RedisKeys.otp(email);
    const codeFound = await this.cachingService.get(name);

    if (codeFound !== code)
      throw new UnauthorizedException(AuthenticationErrors.INCORRECT_OTP);

    await this.removeOtpVerification(email);
  }

  private removeOtpVerification(email: string) {
    const { name } = RedisKeys.otp(email);
    return this.cachingService.del(name);
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationResponse, SendOtpDto, VerifyOtpDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { Environments } from '../common/enums';
import { UsersService } from '../users/users.service';
import { UserErrors } from '../users/enums';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('otp/send')
  async sendCode(@Body() { email }: SendOtpDto) {
    const isExists = await this.usersService.isExistsByEmail(email);
    if (isExists) throw new ForbiddenException(UserErrors.EMAIL_DUPLICATED);

    const code = await this.authenticationService.setOtp(email);
    await this.authenticationService.sendOtp(email, code);

    if (this.configService.get('app.env') !== Environments.PRODUCTION) {
      return { code };
    }
    return {};
  }

  @Post('otp/verify')
  async verifyCode(@Query() { email, code }: VerifyOtpDto) {
    await this.authenticationService.isOtpCorrect(email, code);

    const user = await this.usersService.create(email);
    const accessToken = await this.authenticationService.generateToken(user.id);
    return new AuthenticationResponse({
      user,
      accessToken,
    });
  }
}

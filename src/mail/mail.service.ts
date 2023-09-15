import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environments } from '../common/enums';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmation(email: string, code: string) {
    if (this.configService.get('app.env') === Environments.PRODUCTION) {
      const url = `${this.configService.get(
        'app.domain',
      )}/${this.configService.get(
        'app.apiPrefix',
      )}/authentication/otp/verify?code=${code}&email=${email}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome! Confirm your Email',
        template: './transactional',
        context: {
          url,
        },
      });
    }
  }
}

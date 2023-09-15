import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: 'admin@finotech.ir' })
  @IsEmail()
  email: string;
}

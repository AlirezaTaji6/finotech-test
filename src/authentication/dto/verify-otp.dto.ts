import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, Length } from 'class-validator';
import { otpCodeLength } from '../../common/constants';

export class VerifyOtpDto {
  @ApiProperty({ example: 'admin@finotech.ir' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNumberString()
  @Length(otpCodeLength, otpCodeLength)
  code: string;
}

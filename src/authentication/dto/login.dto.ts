import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@finotech.ir' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678a' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { ValidationConstraints } from '../../common/constants';
import { IsPassword } from '../../common/decorators';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '1234' })
  @IsPassword()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsId } from '../../decorators/validation';

export class IdDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsId({ optional: false })
  id: number;
}

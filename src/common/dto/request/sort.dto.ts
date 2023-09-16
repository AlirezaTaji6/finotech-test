import { IsObject, IsOptional } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SortDto<T = any> extends PaginationDto {
  @ApiProperty({
    type: 'object',
    example: {
      'sort[createdAt]': 'DESC',
    },
    required: true,
  })
  @IsObject()
  @IsOptional()
  sort: FindOptionsOrder<T>;
}

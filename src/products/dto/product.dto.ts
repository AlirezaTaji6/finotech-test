import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../common/dto/response';

export class ProductResponse extends BaseResponse {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  constructor(init: Partial<ProductResponse>) {
    super(init);

    this.title = init.title;
    this.description = init.description;
  }
}

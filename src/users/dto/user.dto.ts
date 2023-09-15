import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from '../../common/dto/response';

export class UserResponse extends BaseResponse {
  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  constructor(init: Partial<UserResponse>) {
    super(init);

    this.email = init.email;
    this.firstName = init.firstName;
    this.lastName = init.lastName;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../../users/dto/user.dto';

export class AuthenticationResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;

  constructor(init: Partial<AuthenticationResponse>) {
    this.accessToken = init.accessToken;
    this.user = init.user ? new UserResponse(init.user) : undefined;
  }
}

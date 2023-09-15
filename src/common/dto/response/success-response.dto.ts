import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<type> {
  @ApiProperty({ type: Object })
  data: type;

  @ApiProperty({ type: Object })
  metadata: object;

  @ApiProperty({ type: String, required: false })
  message?: string;

  @ApiProperty({ type: Number })
  statusCode: number;

  constructor(data: type, metadata = null, message?: string, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}

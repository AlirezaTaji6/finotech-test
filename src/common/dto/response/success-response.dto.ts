import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PageInfoDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  nextPage: number;

  @ApiProperty({ type: Number })
  prePage: number;

  @ApiProperty({ type: Number })
  totalPage: number;
}

export class BaseSuccessResponse<type> {
  @ApiProperty({ type: PageInfoDto, required: false })
  pageInfo?: PageInfoDto;

  @ApiProperty({ type: Object })
  data: type;

  @ApiProperty({ type: Object })
  metadata: object;

  @ApiProperty({ type: String, required: false })
  msg?: string;

  @ApiProperty({ type: String })
  statusCode: string;
}

export class SuccessResponse<type> extends BaseSuccessResponse<type> {
  constructor(data: type, message?: string, statusCode = 200, metadata = null) {
    super();

    this.data = data;
    this.msg = message;
    this.statusCode = String(statusCode);
    this.metadata = metadata;
  }
}

export class PaginatedResponse<type> extends BaseSuccessResponse<type> {
  constructor(
    data: type,
    limit: number,
    currentPage: number,
    total: number,
    message?: string,
    metadata: object = {},
  ) {
    super();

    const totalPagesCount = Math.ceil(total / limit) || 1;
    this.pageInfo = {
      total,
      nextPage:
        currentPage === totalPagesCount || total === 0 ? null : currentPage + 1,
      prePage: currentPage === 1 || total === 0 ? null : currentPage - 1,
      totalPage: total === 0 ? 0 : totalPagesCount,
    };
    this.data = data;
    this.metadata = metadata;
    this.msg = message;
    this.statusCode = String(HttpStatus.OK);
  }
}

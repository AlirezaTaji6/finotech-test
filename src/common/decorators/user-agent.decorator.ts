import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    return userAgent;
  },
);

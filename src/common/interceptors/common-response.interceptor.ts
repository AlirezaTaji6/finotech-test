import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { SuccessResponse } from '../dto/response';
import { map } from 'rxjs';

@Injectable()
export class CommonResponseInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) return data;
        return new SuccessResponse(data);
      }),
    );
  }
}

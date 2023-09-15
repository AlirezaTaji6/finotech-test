import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommonErrors } from '../enums';

@Injectable()
export class UserAgentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['user-agent'])
      throw new ForbiddenException(CommonErrors.USER_AGENT_NOT_SET);
    return true;
  }
}

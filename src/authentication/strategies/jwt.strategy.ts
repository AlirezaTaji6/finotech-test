import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticationErrors } from '../enums';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

type JwtPayload = Pick<User, 'id'> & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  public async validate(payload: JwtPayload) {
    if (!payload.id)
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);

    const userFound = await this.usersService.findOne(payload.id);
    return userFound;
  }
}

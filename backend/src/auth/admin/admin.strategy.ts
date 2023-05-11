import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JWTRequest } from '../jwt/jwt.request';
import { USER_TYPE } from 'src/types/users.type';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: JWTRequest): Promise<Boolean> {
    if (req.user.type != USER_TYPE.ADMIN) throw new UnauthorizedException();
    const isAdmin: Boolean = await this.authService.validateAdmin(req.user.userid);
    if (!isAdmin) throw new UnauthorizedException();
    return true;
  }
}
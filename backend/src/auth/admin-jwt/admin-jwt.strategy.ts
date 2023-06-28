import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { USER_TYPE } from 'src/types/users.type';
import { ExtractJwt } from 'passport-jwt';
import { AdminRequest } from '../admin/admin.request';

@Injectable()
export class AdminJWTStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(req: AdminRequest): Promise<Boolean> {
    if (req.admin.user.type != USER_TYPE.ADMIN) throw new UnauthorizedException();
    const isAdmin: Boolean = await this.authService.validateJWTAdmin(req.admin.user.userid);
    if (!isAdmin) throw new UnauthorizedException();
    return true;
  }
}
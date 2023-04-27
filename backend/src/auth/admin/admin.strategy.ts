import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JWTRequest } from '../jwt/jwt.request';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: JWTRequest): Promise<Boolean> {
    if (req.user.type != "admin") throw new UnauthorizedException();
    const isAdmin: Boolean = await this.authService.validateAdmin(req.user.userid);
    if (!isAdmin) throw new UnauthorizedException();
    return true;
  }
}
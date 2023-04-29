import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicUser } from 'src/entities/basicuser/entities/basicuser.entity';
import { AuthService } from '../auth.service';
import { BasicUserLoginDto } from './userlogin.dto';

@Injectable()
export class BasicUserStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(data: BasicUserLoginDto): Promise<BasicUser> {
    const user: BasicUser = await this.authService.validateUser(data);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
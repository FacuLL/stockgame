import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicUser } from 'src/entities/basicuser/entities/basicuser.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicUserStrategy extends PassportStrategy(Strategy, 'basicuser') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<BasicUser> {
    const user: BasicUser = await this.authService.validateUser({
      username: username,
      password: password
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
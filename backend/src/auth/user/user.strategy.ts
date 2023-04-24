import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicUser } from 'src/basicuser/entities/basicuser.entity';
import { AuthService } from '../auth.service';
import { UserLoginDto } from '../dto/userlogin.dto';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(data: UserLoginDto): Promise<BasicUser> {
    const user: BasicUser = await this.authService.validateUser(data);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
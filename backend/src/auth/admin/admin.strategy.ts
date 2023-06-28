import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Admin } from 'src/entities/admin/entities/admin.entity';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Admin> {
    const admin: Admin = await this.authService.validateAdmin({
        username: username,
        password: password
    });
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}
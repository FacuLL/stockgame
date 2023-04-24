import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserStrategy } from './user/user.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' }
    })
  ],
  controllers: [AuthController, PassportModule],
  providers: [AuthService, UserStrategy, JwtStrategy]
})
export class AuthModule {}

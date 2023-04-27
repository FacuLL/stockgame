import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BasicUserStrategy } from './basicuser/basicuser.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicUser } from 'src/basicuser/entities/basicuser.entity';
import { User } from 'src/user/entities/user.entity';
import { Institution } from 'src/institution/entities/institution.entity';
import { InstitutionStrategy } from './institution/institution.strategy';
import { AdminStrategy } from './admin/admin.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' }
    }),
    TypeOrmModule.forFeature([BasicUser, User, Institution])
  ],
  controllers: [AuthController, PassportModule],
  providers: [AuthService, BasicUserStrategy, JwtStrategy, InstitutionStrategy, AdminStrategy]
})
export class AuthModule {}

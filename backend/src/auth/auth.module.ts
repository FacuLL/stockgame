import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BasicUserStrategy } from './basicuser/basicuser.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicUser } from 'src/entities/basicuser/entities/basicuser.entity';
import { User } from 'src/entities/user/entities/user.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { InstitutionStrategy } from './institution/institution.strategy';
import * as dotenv from 'dotenv';
import { Admin } from 'src/entities/admin/entities/admin.entity';
import { AdminStrategy } from './admin/admin.strategy';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' }
    }),
    TypeOrmModule.forFeature([BasicUser, User, Institution, Admin]),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, BasicUserStrategy, JwtStrategy, InstitutionStrategy, AdminStrategy],
  exports: [AuthService]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicuserModule } from '../basicuser/basicuser.module';
import { InstitutionModule } from '../institution/institution.module';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BasicuserModule, InstitutionModule, AdminModule, AuthModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

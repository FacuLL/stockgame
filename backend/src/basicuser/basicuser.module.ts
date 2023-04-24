import { Module } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { BasicuserController } from './basicuser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicUser } from './entities/basicuser.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasicUser, User])],
  controllers: [BasicuserController],
  providers: [BasicuserService]
})
export class BasicuserModule {}

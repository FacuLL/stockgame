import { Module } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { BasicuserController } from './basicuser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicUser } from './entities/basicuser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasicUser])],
  controllers: [BasicuserController],
  providers: [BasicuserService],
  exports: [BasicuserService]
})
export class BasicuserModule {}

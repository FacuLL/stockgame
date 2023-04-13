import { Module } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { BasicuserController } from './basicuser.controller';

@Module({
  controllers: [BasicuserController],
  providers: [BasicuserService]
})
export class BasicuserModule {}

import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { Share } from './entities/share.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Share])],
  controllers: [ShareController],
  providers: [ShareService]
})
export class ShareModule {}

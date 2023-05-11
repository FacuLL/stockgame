import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { Share } from './entities/share.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from '../provider/entities/provider.entity';
import { Currency } from '../currency/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Share, Provider, Currency])],
  controllers: [ShareController],
  providers: [ShareService]
})
export class ShareModule {}

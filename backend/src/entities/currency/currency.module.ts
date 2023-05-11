import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Provider } from '../provider/entities/provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Provider])],
  controllers: [CurrencyController],
  providers: [CurrencyService]
})
export class CurrencyModule {}

import { Module } from '@nestjs/common';
import { HistoricalassetService } from './historicalasset.service';
import { HistoricalassetController } from './historicalasset.controller';

@Module({
  controllers: [HistoricalassetController],
  providers: [HistoricalassetService]
})
export class HistoricalassetModule {}

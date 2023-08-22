import { Controller } from '@nestjs/common';
import { HistoricalassetService } from './historicalasset.service';

@Controller('historicalasset')
export class HistoricalassetController {
  constructor(private readonly historicalassetService: HistoricalassetService) {}
}

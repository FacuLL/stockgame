import { Module } from '@nestjs/common';
import { AssetTasksService } from './asset-tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from 'src/entities/provider/entities/provider.entity';
import { Asset } from 'src/entities/asset/entities/asset.entity';
import { HistoricalAsset } from 'src/entities/historicalasset/entities/historicalasset.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Provider, Asset, HistoricalAsset]), HttpModule],
    providers: [AssetTasksService]
})
export class TasksModule {}

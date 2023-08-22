import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { HistoricalAsset } from "src/entities/historicalasset/entities/historicalasset.entity";
import { Repository } from "typeorm";

@Injectable()
export class AssetTasksService {

  constructor(
    @InjectRepository(Asset) private readonly assetRepostory: Repository<Asset>,
    @InjectRepository(HistoricalAsset) private readonly historicalassetRepostory: Repository<HistoricalAsset>,
    private readonly httpService: HttpService
  ) {}

  @Cron('* 0,30 * * * *')
  async periodicUpdate() {
    let assets: Asset[] = await this.assetRepostory.find({ where: { automatized: true }, relations: ['provider'] });
    assets.forEach(async asset => {
        if (asset.provider.assetendpoint) {
            let historical: HistoricalAsset = new HistoricalAsset({
              open: asset.open,
              close: asset.price,
              volume: asset.volume,
              high: asset.high,
              low: asset.low
            }, new Date(), asset, asset.provider);
            this.historicalassetRepostory.save(historical);
            this.assetUpdate(asset);
        }
    })
  }

  async assetUpdate(asset: Asset): Promise<boolean> {
    try {
      let response: any = await this.httpService.get(asset.provider.assetendpoint.replace('$CODE', asset.code));
      let properties: string[] = ['open', 'close', 'volume', 'high', 'low'];
      let data: any = response;
      for (let i = 0; i < properties.length; i++) {
        let path: string[] = asset.provider["pathto" + properties[i]].split('.');
        for (let i = 0; i < path.length; i++) {
          let sub: number = path[i].indexOf("[");
          if (sub >= 0) {
            let modified: string = [...path[i]].splice(sub, path[i].length).join('');
            data = data[modified];
            data = data[sub++];
          }
        }
        asset[properties[i]] = data;
      }
      asset.lastupdate = new Date();
      this.assetRepostory.save(asset);
      return true;
    }
    catch(e) {
      return false;
    }
  }
}

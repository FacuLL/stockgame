import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { Repository } from 'typeorm';
import { FindAssetDto } from './dto/find-asset-dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AssetService {

  constructor (
    @InjectRepository(Asset) private readonly assetRepostory: Repository<Asset>,
    private readonly httpService: HttpService
  ) {}

  findAll(params: FindAssetDto): Promise<Asset[]> {
    return this.assetRepostory.find({ where: { ...params }, relations: { provider: true, games: true } });
  }

  findOne(id: number): Promise<Asset> {
    return this.assetRepostory.findOne({ where: { assetid: id }, relations: { provider: true, games: true } });
  }

  async delete(id: number): Promise<HttpStatus> {
    let asset: Asset = await this.findOne(id);
    if (!asset) throw new NotFoundException();
    return HttpStatus.OK;
  }

  async getHistoricalAsset(asset: Asset): Promise<Boolean> {
    if (!asset.provider.historicalendpoint) throw new ConflictException('Provider does not have historical endpoint');
    let response: any = await this.httpService.get(asset.provider.assetendpoint);
    return true;
  }
}

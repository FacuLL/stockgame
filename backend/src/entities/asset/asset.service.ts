import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { Repository } from 'typeorm';
import { FindAssetDto } from './dto/find-asset-dto';
import { HttpService } from '@nestjs/axios';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { AssetToUser } from 'src/relations/entities/asset-user.entity';

@Injectable()
export class AssetService {

  constructor (
    @InjectRepository(Asset) private readonly assetRepostory: Repository<Asset>,
    @InjectRepository(AssetToUser) private readonly assetUserRepostory: Repository<AssetToUser>,
    private readonly httpService: HttpService
  ) {}

  findAll(params: FindAssetDto): Promise<Asset[]> {
    return this.assetRepostory.find({ where: { ...params }, relations: { provider: true, games: true } });
  }

  async findOne(req: JWTRequest, id: number, gameid?: number): Promise<Asset | AssetToUser> {
    if (req.user.type == 'admin') return this.assetRepostory.findOne({ where: { assetid: id }, relations: ['provider', 'games'] });
    let relation = await this.assetUserRepostory.findOne({ where: { asset: { assetid: id }, instance: { game: { gameid: gameid } } }, relations: ['asset', 'instance', 'instance.game', 'instance.transactions', 'instance.transactions.asset'] });
    let asset: any = await this.assetRepostory.findOne({ where: { assetid: id }, relations: ['provider', 'games'] });
    asset.extra = relation;
    return asset;
  }

  async delete(id: number): Promise<HttpStatus> {
    let asset: Asset = await this.assetRepostory.findOne({ where: { assetid: id } });
    if (!asset) throw new NotFoundException();
    return HttpStatus.OK;
  }

  async getHistoricalAsset(asset: Asset): Promise<Boolean> {
    if (!asset.provider.historicalendpoint) throw new ConflictException('Provider does not have historical endpoint');
    let response: any = await this.httpService.get(asset.provider.assetendpoint);
    return true;
  }
}

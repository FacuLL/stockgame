import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';
import { DataSource, Repository } from 'typeorm';
import { Share } from './entities/share.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../provider/entities/provider.entity';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { Asset } from '../asset/entities/asset.entity';
import { Currency } from '../currency/entities/currency.entity';
import { FindShareDto } from './dto/find-share.dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';
import { deleteEmptyFields } from 'src/utils/data-transform';

@Injectable()
export class ShareService {

  constructor(
    @InjectRepository(Share) private readonly shareRepostory: Repository<Share>,
    @InjectRepository(Provider) private readonly providerRepostory: Repository<Provider>,
    @InjectRepository(Currency) private readonly currencyRepostory: Repository<Currency>,
    private dataSource: DataSource
  ) {}

  async create(createAssetDto: CreateAssetDto, createShareDto: CreateShareDto): Promise<HttpStatus> {
    let provider: Provider = await this.providerRepostory.findOne({ where: { providerid: createAssetDto.providerid } });
    if (!provider && createAssetDto.automatized) throw new NotFoundException();
    let currency: Currency = await this.currencyRepostory.findOne({ where: { currencyid: createAssetDto.currencyid } });
    if (!currency) throw new NotFoundException();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let asset: Asset = new Asset(createAssetDto, provider, currency);
      let share: Share = new Share(createShareDto, asset);
      await queryRunner.manager.save(asset);
      await queryRunner.manager.save(share);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(params: FindShareDto): Promise<Share[]> {
    return this.shareRepostory.find({ where: { ...params }, relations: { asset: true } });
  }

  findOne(id: number): Promise<Share> {
    return this.shareRepostory.findOne({ where: { shareid: id }, relations: { asset: true } });
  }

  async update(id: number, updateAssetDto: UpdateAssetDto, updateShareDto: UpdateShareDto): Promise<HttpStatus> {
    let share: Share = await this.findOne(id);
    if (!share) throw new NotFoundException();
    updateShareDto = deleteEmptyFields(updateShareDto);
    updateAssetDto = deleteEmptyFields(updateAssetDto);
    share.updateData(updateShareDto);
    share.asset.updateData(updateAssetDto);
    this.shareRepostory.save(share);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let share: Share = await this.findOne(id);
    if (!share) throw new NotFoundException();
    this.shareRepostory.delete(id);
    return HttpStatus.OK;
  }
}

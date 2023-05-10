import { HttpStatus, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { Asset } from '../asset/entities/asset.entity';
import { Provider } from '../provider/entities/provider.entity';
import { FindCurrencyDto } from './dto/find-currency.dto';
import { deleteEmptyFields } from 'src/utils/data-transform';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';

@Injectable()
export class CurrencyService {

  constructor(
    @InjectRepository(Currency) private readonly currencyRepostory: Repository<Currency>,
    @InjectRepository(Provider) private readonly providerRepostory: Repository<Provider>,
    private dataSource: DataSource 
  ) {}

  async create(createAssetDto: CreateAssetDto, createCurrencyDto: CreateCurrencyDto): Promise<HttpStatus> {
    let provider: Provider = await this.providerRepostory.findOne({ where: { providerid: createAssetDto.providerid } });
    if (!provider) throw new NotFoundException();
    let maincurrency: Currency = await this.currencyRepostory.findOne({ where: { main: true } });
    if (!maincurrency) throw new ConflictException();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let asset: Asset = new Asset(createAssetDto, provider, maincurrency);
      let currency: Currency = new Currency(createCurrencyDto, asset);
      await queryRunner.manager.save(asset);
      await queryRunner.manager.save(currency);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(params: FindCurrencyDto): Promise<Currency[]> {
    return this.currencyRepostory.find({ where: { ...params }, relations: { asset: true } });
  }

  findOne(id: number): Promise<Currency> {
    return this.currencyRepostory.findOne({ where: { currencyid: id }, relations: { asset: true } });
  }

  async update(id: number, updateAssetDto: UpdateAssetDto, updateCurrencyDto: UpdateCurrencyDto): Promise<HttpStatus> {
    let currency: Currency = await this.findOne(id);
    if (!currency) throw new NotFoundException();
    updateCurrencyDto = deleteEmptyFields(updateCurrencyDto);
    updateAssetDto = deleteEmptyFields(updateAssetDto);
    currency.updateData(updateCurrencyDto);
    currency.asset.updateData(updateAssetDto);
    this.currencyRepostory.save(currency);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let currency: Currency = await this.findOne(id);
    if (!currency) throw new NotFoundException();
    this.currencyRepostory.delete(id);
    return HttpStatus.OK;
  }
}

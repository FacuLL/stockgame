import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindProviderDto } from './dto/find-provider.dto';
import { deleteEmptyFields } from 'src/utils/data-transform';

@Injectable()
export class ProviderService {

  constructor(
    @InjectRepository(Provider) private readonly providerRepostory: Repository<Provider>
  ) {}

  async create(createProviderDto: CreateProviderDto): Promise<HttpStatus> {
    let provider: Provider = new Provider(createProviderDto);
    await this.providerRepostory.save(provider);
    return HttpStatus.OK;
  }

  findAll(params: FindProviderDto): Promise<Provider[]> {
    return this.providerRepostory.find({ where: { ...params }, relations: { assets: true } });
  }

  findOne(id: number): Promise<Provider> {
    return this.providerRepostory.findOne({ where: { providerid: id }, relations: { assets: true } });
  }

  async update(id: number, updateProviderDto: UpdateProviderDto): Promise<HttpStatus> {
    let provider: Provider = await this.findOne(id);
    if (!provider) throw new NotFoundException();
    updateProviderDto = deleteEmptyFields(updateProviderDto);
    provider.updateData(updateProviderDto);
    await this.providerRepostory.save(provider);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let provider: Provider = await this.findOne(id);
    if (!provider) throw new NotFoundException();
    this.providerRepostory.delete(id);
    return HttpStatus.OK;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { FindAssetDto } from '../asset/dto/find-asset-dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto, @Body() createAssetDto: CreateAssetDto) {
    return this.currencyService.create(createAssetDto, createCurrencyDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll(@Query() params: FindAssetDto) {
    return this.currencyService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(+id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto, @Body() updateAssetDto: UpdateAssetDto) {
    return this.currencyService.update(+id, updateAssetDto, updateCurrencyDto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.delete(+id);
  }
}

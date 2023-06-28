import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { FindAssetDto } from '../asset/dto/find-asset-dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto, @Body() createAssetDto: CreateAssetDto) {
    return this.currencyService.create(createAssetDto, createCurrencyDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindAssetDto) {
    return this.currencyService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(+id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto, @Body() updateAssetDto: UpdateAssetDto) {
    return this.currencyService.update(+id, updateAssetDto, updateCurrencyDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.delete(+id);
  }
}

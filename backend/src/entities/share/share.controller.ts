import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';
import { FindShareDto } from './dto/find-share.dto';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  create(@Body() createShareDto: CreateShareDto, @Body() createAssetDto: CreateAssetDto) {
    return this.shareService.create(createAssetDto, createShareDto);
  }

  @Get()
  findAll(@Query() params: FindShareDto) {
    return this.shareService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShareDto: UpdateShareDto, @Body() updateAssetDto: UpdateAssetDto) {
    return this.shareService.update(+id, updateAssetDto, updateShareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareService.delete(+id);
  }
}

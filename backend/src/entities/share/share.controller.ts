import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';
import { FindShareDto } from './dto/find-share.dto';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Post()
  create(@Body() createShareDto: CreateShareDto, @Body() createAssetDto: CreateAssetDto) {
    return this.shareService.create(createAssetDto, createShareDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindShareDto) {
    return this.shareService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(+id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShareDto: UpdateShareDto, @Body() updateAssetDto: UpdateAssetDto) {
    return this.shareService.update(+id, updateAssetDto, updateShareDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareService.delete(+id);
  }
}

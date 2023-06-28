import { Controller, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { FindAssetDto } from './dto/find-asset-dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindAssetDto) {
    return this.assetService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(+id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.delete(+id);
  }
}

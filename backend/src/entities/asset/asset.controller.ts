import { Controller, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { FindAssetDto } from './dto/find-asset-dto';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll(@Query() params: FindAssetDto) {
    return this.assetService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetService.findOne(+id);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.delete(+id);
  }
}

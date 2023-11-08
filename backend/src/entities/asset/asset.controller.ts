import { Controller, Get, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AssetService } from './asset.service';
import { FindAssetDto } from './dto/find-asset-dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindAssetDto) {
    return this.assetService.findAll(params);
  }

  @Get(':id')
  findOne(@Request() req: JWTRequest, @Param('id') id: string, @Query('gameid') gameid: string) {
    return this.assetService.findOne(req, +id, +gameid);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetService.delete(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { FindProviderDto } from './dto/find-provider.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindProviderDto) {
    return this.providerService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerService.findOne(+id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providerService.update(+id, updateProviderDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerService.delete(+id);
  }
}

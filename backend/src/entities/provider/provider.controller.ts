import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { FindProviderDto } from './dto/find-provider.dto';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll(@Query() params: FindProviderDto) {
    return this.providerService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerService.findOne(+id);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providerService.update(+id, updateProviderDto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerService.delete(+id);
  }
}

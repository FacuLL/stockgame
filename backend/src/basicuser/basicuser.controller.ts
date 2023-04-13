import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';

@Controller('basicuser')
export class BasicuserController {
  constructor(private readonly basicuserService: BasicuserService) {}

  @Post()
  create(@Body() createBasicuserDto: CreateBasicuserDto) {
    return this.basicuserService.create(createBasicuserDto);
  }

  @Get()
  findAll() {
    return this.basicuserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basicuserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasicuserDto: UpdateBasicuserDto) {
    return this.basicuserService.update(+id, updateBasicuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basicuserService.remove(+id);
  }
}

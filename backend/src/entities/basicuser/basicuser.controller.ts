import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpStatus, Patch, Request } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { Public } from 'src/auth/public/public.decorator';
import { FindBasicuserDto } from './dto/find-basicuser.dto';
import { BasicUser } from './entities/basicuser.entity';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';

@Controller('basicuser')
export class BasicuserController {
  constructor(private readonly basicuserService: BasicuserService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto, @Body() createBasicuserDto: CreateBasicuserDto): Promise<HttpStatus> {
    return this.basicuserService.create(createUserDto, createBasicuserDto);
  }

  @Patch('')
  update(@Request() req: JWTRequest, @Body() updateBasicUserDto: UpdateBasicuserDto): Promise<HttpStatus> {
    return this.basicuserService.update(req, updateBasicUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('')
  find(@Query() params: FindBasicuserDto): Promise<BasicUser[]> {
    return this.basicuserService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<BasicUser> {
    return this.basicuserService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  delete(@Param(':id') id: number): Promise<HttpStatus> {
    return this.basicuserService.delete(id);
  }

}

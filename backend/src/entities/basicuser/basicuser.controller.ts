import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpStatus, Patch, Request } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { Public } from 'src/auth/public/public.decorator';
import { FindBasicuserDto } from './dto/find-basicuser.dto';
import { BasicUser } from './entities/basicuser.entity';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('basicuser')
export class BasicuserController {
  constructor(private readonly basicuserService: BasicuserService) {}

  @Public()
  @Post('')
  create(@Body() createUserDto: CreateUserDto, @Body() createBasicuserDto: CreateBasicuserDto): Promise<HttpStatus> {
    return this.basicuserService.create(createUserDto, createBasicuserDto);
  }

  @Patch('')
  update(@Request() req: JWTRequest, @Body() updateBasicUserDto: UpdateBasicuserDto, @Body() updateUserDto: UpdateUserDto): Promise<HttpStatus> {
    return this.basicuserService.update(req, updateBasicUserDto, updateUserDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get('')
  find(@Query() params: FindBasicuserDto): Promise<BasicUser[]> {
    return this.basicuserService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<BasicUser> {
    return this.basicuserService.findOne(id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  delete(@Param(':id') id: number): Promise<HttpStatus> {
    return this.basicuserService.delete(id);
  }

}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/auth/public/public.decorator';
import { FindBasicuserDto } from './dto/find-basicuser.dto';

@Controller('basicuser')
export class BasicuserController {
  constructor(private readonly basicuserService: BasicuserService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto, @Body() createBasicuserDto: CreateBasicuserDto) {
    return this.basicuserService.create(createUserDto, createBasicuserDto);
  }

  @Get('')
  find(@Query() params: FindBasicuserDto) {

  }
  
}

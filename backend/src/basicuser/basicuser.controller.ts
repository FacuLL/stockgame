import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasicuserService } from './basicuser.service';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('basicuser')
export class BasicuserController {
  constructor(private readonly basicuserService: BasicuserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto, @Body() createBasicuserDto: CreateBasicuserDto) {
    return this.basicuserService.create(createUserDto, createBasicuserDto);
  }
  
}

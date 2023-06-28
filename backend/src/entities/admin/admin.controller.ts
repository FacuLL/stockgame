import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpStatus, Patch, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { FindAdminDto } from './dto/find-admin.dto';
import { Admin } from './entities/admin.entity';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Post('')
  create(@Body() createUserDto: CreateUserDto, @Body() createAdminDto: CreateAdminDto): Promise<HttpStatus> {
    return this.adminService.create(createUserDto, createAdminDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Patch('')
  update(@Request() req: JWTRequest, @Body() updateAdminDto: UpdateAdminDto, @Body() updateUserDto: UpdateUserDto): Promise<HttpStatus> {
    return this.adminService.update(req, updateAdminDto, updateUserDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get('')
  find(@Query() params: FindAdminDto): Promise<Admin[]> {
    return this.adminService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  delete(@Param(':id') id: number): Promise<HttpStatus> {
    return this.adminService.delete(id);
  }

}

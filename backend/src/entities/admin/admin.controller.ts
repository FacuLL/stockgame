import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpStatus, Patch, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { FindAdminDto } from './dto/find-admin.dto';
import { Admin } from './entities/admin.entity';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminAuthGuard)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto, @Body() createAdminDto: CreateAdminDto): Promise<HttpStatus> {
    return this.adminService.create(createUserDto, createAdminDto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('')
  update(@Request() req: JWTRequest, @Body() updateAdminDto: UpdateAdminDto, @Body() updateUserDto: UpdateUserDto): Promise<HttpStatus> {
    return this.adminService.update(req, updateAdminDto, updateUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('')
  find(@Query() params: FindAdminDto): Promise<Admin[]> {
    return this.adminService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  delete(@Param(':id') id: number): Promise<HttpStatus> {
    return this.adminService.delete(id);
  }

}

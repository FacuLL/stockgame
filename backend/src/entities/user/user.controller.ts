import { Controller, Get, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { User } from './entities/user.entity';
import { BasicUser } from '../basicuser/entities/basicuser.entity';
import { Institution } from '../institution/entities/institution.entity';
import { FindUserDto } from './dto/find-user.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindUserDto): Promise<User[]> {
    return this.userService.findAll(params);
  }

  @Get('profile')
  getProfile(@Request() req: JWTRequest): Promise<User | BasicUser | Institution> {
    return this.userService.getProfile(req);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Delete('')
  deleteAccount(@Request() req: JWTRequest) {
    return this.userService.deleteAccount(req);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}

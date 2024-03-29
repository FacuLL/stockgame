import { Controller, Get, Post, Body, Patch, Param, Query, Request, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { FindInstitutionDto } from './dto/find-institution.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { Institution } from './entities/institution.entity';
import { Public } from 'src/auth/public/public.decorator';

@Controller('institution')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Body() createInstitutionDto: CreateInstitutionDto): Promise<HttpStatus> {
    return this.institutionService.create(createUserDto, createInstitutionDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindInstitutionDto): Promise<Institution[]> {
    return this.institutionService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Institution> {
    return this.institutionService.findOne(+id);
  }

  @Patch('')
  update(@Request() req: JWTRequest, @Body() updateInstitutionDto: UpdateInstitutionDto): Promise<HttpStatus> {
    return this.institutionService.update(req, updateInstitutionDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<HttpStatus> {
    return this.institutionService.delete(+id);
  }
}

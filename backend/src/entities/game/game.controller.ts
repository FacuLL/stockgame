import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { FindGameDto } from './dto/find-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  createInstitutionGame(@Request() req: JWTRequest, @Body() createGameDto: CreateGameDto) {
    return this.gameService.createInstitutionGame(req, createGameDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Post('/global')
  createGlobalGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGlobalGame(createGameDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindGameDto) {
    return this.gameService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  updateInstitutionGame(@Request() req: JWTRequest, @Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.updateInstitutionGame(req, +id, updateGameDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete('admin/:id')
  delete(@Param('id') id: string) {
    return this.gameService.delete(+id);
  }

  @Delete(':id')
  deleteInstitutionGame(@Request() req: JWTRequest, @Param('id') id: string) {
    return this.gameService.deleteInstitutionGame(req, +id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, HttpStatus } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { FindGameDto } from './dto/find-game.dto';
import { Game } from './entities/game.entity';

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

  @Get('/global')
  findGlobal(): Promise<Game[]> {
    return this.gameService.getGlobalGames();
  }

  @Post('/global/:id')
  joinGlobal(@Request() req: JWTRequest, @Param('id') gameid: number): Promise<HttpStatus> {
    return this.gameService.joinGlobalGame(req, gameid)
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get()
  findAll(@Query() params: FindGameDto) {
    return this.gameService.findAll(params);
  }

  @Get(':id')
  findOne(@Request() req: JWTRequest, @Param('id') id: string) {
    return this.gameService.findOne(req, +id);
  }

  @Patch(':id')
  updateInstitutionGame(@Request() req: JWTRequest, @Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.updateInstitutionGame(req, +id, updateGameDto);
  }

  @Post(':gameid/asset/:assetid')
  addAssetToGame(@Request() req: JWTRequest, @Param('gameid') gameid: number, @Param('assetid') assetid: number) {
    return this.gameService.addAssetToGame(req, gameid, assetid);
  }

  @Delete(':gameid/asset/:assetid')
  deleteAssetFromGame(@Request() req: JWTRequest, @Param('gameid') gameid: number, @Param('assetid') assetid: number) {
    return this.gameService.deleteAssetFromGame(req, gameid, assetid);
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

  @Get(':id/popularAssets')
  findPopularAssets(@Request() req: JWTRequest, @Param('id') gameid: number) {
    return this.gameService.popularAssets(req, gameid);
  }
}

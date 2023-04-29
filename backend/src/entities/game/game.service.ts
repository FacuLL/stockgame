import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { Game } from './entities/game.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindGameDto } from './dto/find-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepostory: Repository<Game>,
    @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
  ) {}

  async createInstitutionGame(req: JWTRequest, createGameDto: CreateGameDto): Promise<HttpStatus> {
    if (req.user.type != "institution") throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let game: Game = new Game(createGameDto, false, institution);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async createGlobalGame(createGameDto: CreateGameDto): Promise<HttpStatus> {
    let game: Game = new Game(createGameDto, true);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  findAll(params: FindGameDto): Promise<Game[]> {
    return this.gameRepostory.find({ where: { ...params }, relations: { institutions: true, owner: true, shares: true } })
  }

  findOne(id: number): Promise<Game> {
    return this.gameRepostory.findOne({ where: { gameid: id }, relations: { institutions: true, owner: true, shares: true } });
  }

  async updateInstitutionGame(req: JWTRequest, id: number, updateGameDto: UpdateGameDto): Promise<HttpStatus> {
    if (req.user.type != "institution") throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let game: Game = await this.gameRepostory.findOne({ where: { gameid: id }, relations: { owner: true } });
    if (!game || game.owner.institutionid != institution.institutionid) throw new UnauthorizedException();
    game.updateData(updateGameDto);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async updateGlobalGame(id:number, updateGameDto: UpdateGameDto): Promise<HttpStatus> {
    let game: Game = await this.findOne(id);
    if (!game || !game.global) throw new NotFoundException();
    game.updateData(updateGameDto);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let game: Game = await this.findOne(id);
    if (!game) throw new NotFoundException();
    await this.gameRepostory.delete(id);
    return HttpStatus.OK;
  }

  async inviteInstitution(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  async deleteInstitutionGame(req: JWTRequest, id: number): Promise<HttpStatus> {
    if (req.user.type != "institution") throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let game: Game = await this.findOne(id);
    if (!game || game.owner.institutionid != institution.institutionid) throw new NotFoundException();
    await this.gameRepostory.delete(id);
    return HttpStatus.OK;
  }
}

import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { Game } from './entities/game.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { FindGameDto } from './dto/find-game.dto';
import { USER_TYPE } from 'src/types/users.type';
import { Currency } from '../currency/entities/currency.entity';
import { deleteEmptyFields } from 'src/utils/data-transform';
import { UserToGame } from 'src/relations/entities/user-game.entity';
import { User } from '../user/entities/user.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Asset } from '../asset/entities/asset.entity';
import * as moment from 'moment';
import { AssetToGame } from 'src/relations/entities/asset-game.entity';
import { AssetToUser } from 'src/relations/entities/asset-user.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepostory: Repository<Game>,
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
    @InjectRepository(Currency) private readonly currencyRepostory: Repository<Currency>,
    @InjectRepository(UserToGame) private readonly userGameRepostory: Repository<UserToGame>,
    @InjectRepository(Transaction) private readonly transactionRepostory: Repository<Transaction>,
    @InjectRepository(Asset) private readonly assetRepostory: Repository<Asset>,
    @InjectRepository(AssetToGame) private readonly assetGameRepostory: Repository<AssetToGame>
  ) {}

  async createInstitutionGame(req: JWTRequest, createGameDto: CreateGameDto): Promise<HttpStatus> {
    if (req.user.type != USER_TYPE.INSTITUTION) throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let currency: Currency = await this.currencyRepostory.findOne({ where: { currencyid: createGameDto.currencyid } });
    if (!currency) throw new NotFoundException();
    let game: Game = new Game(createGameDto, false, currency, institution);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async createGlobalGame(createGameDto: CreateGameDto): Promise<HttpStatus> {
    let currency: Currency = await this.currencyRepostory.findOne({ where: { currencyid: createGameDto.currencyid } });
    if (!currency) throw new NotFoundException();
    let game: Game = new Game(createGameDto, true, currency);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async addAssetToGame(req: JWTRequest, gameid: number, assetid: number) {
    let game: Game = await this.gameRepostory.findOne({ where: { gameid: gameid }, relations: ['owner', 'owner.user'] });
    if (!game) throw new NotFoundException();
    if (game.global && req.user.type != "admin") throw new NotFoundException();
    if (!game.global && game.owner.user.userid != req.user.userid) throw new NotFoundException();
    let asset: Asset = await this.assetRepostory.findOne({ where: { assetid: assetid } });
    if (!asset) throw new NotFoundException();
    if (await this.assetGameRepostory.findOne({ where: { asset: { assetid: assetid }, game: { gameid: gameid } }, relations: ['asset', 'game'] })) throw new ConflictException();
    let relation: AssetToGame = new AssetToGame(game, asset);
    this.assetGameRepostory.save(relation);
  }

  async deleteAssetFromGame(req: JWTRequest, gameid: number, assetid: number): Promise<HttpStatus> {
    let relation: AssetToGame = await this.assetGameRepostory.findOne({ where: { game: { gameid: gameid }, asset: { assetid: assetid } }, relations: ['game', 'asset', 'game.owner', 'game.owner.user'] });
    if (!relation) throw new NotFoundException();
    if (relation.game.global && req.user.type != "admin") throw new NotFoundException();
    if (!relation.game.global && relation.game.owner.user.userid != req.user.userid) throw new NotFoundException();
    this.assetGameRepostory.delete(relation.assetgameid);
    return HttpStatus.OK;
  }

  findAll(params: FindGameDto): Promise<Game[]> {
    return this.gameRepostory.find({ where: { ...params }, relations: { institutions: true, owner: true, assets: true } })
  }

  async findOne(req: JWTRequest, id: number): Promise<Game | UserToGame> {
    if (req.user.type == 'admin') return this.gameRepostory.findOne({ where: { gameid: id }, relations: ['institutions', 'owner', 'assets'] });
    let relation: UserToGame = await this.userGameRepostory.findOne({ where: { game: { gameid: id }, user: { userid: req.user.userid } }, relations: ['game', 'game.assets', 'game.assets.asset', 'user', 'transactions', 'transactions.asset', 'assets', 'assets.asset'] });
    if (!relation) throw new NotFoundException();
    return relation;
  }

  async updateInstitutionGame(req: JWTRequest, id: number, updateGameDto: UpdateGameDto): Promise<HttpStatus> {
    if (req.user.type != USER_TYPE.INSTITUTION) throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let game: Game = await this.gameRepostory.findOne({ where: { gameid: id }, relations: { owner: true } });
    if (!game || game.owner.institutionid != institution.institutionid) throw new UnauthorizedException();
    updateGameDto = deleteEmptyFields(updateGameDto);
    game.updateData(updateGameDto);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  async updateGlobalGame(id:number, updateGameDto: UpdateGameDto): Promise<HttpStatus> {
    let game: Game = await this.gameRepostory.findOne({where: {gameid: id}});
    if (!game || !game.global) throw new NotFoundException();
    game.updateData(updateGameDto);
    await this.gameRepostory.save(game);
    return HttpStatus.OK;
  }

  getGlobalGames(): Promise<Game[]> {
    return this.gameRepostory.find({ where: { global: true }, relations: ['maincurrency', 'maincurrency.asset'] });
  }

  async joinGlobalGame(req: JWTRequest, gameid: number): Promise<HttpStatus> {
    if (req.user.type != "basicuser" && req.user.type != "team") throw new ConflictException();
    let game: Game = await this.gameRepostory.findOne({ where: { gameid: gameid, global: true } });
    if (!game) throw new NotFoundException();
    let user: User = await this.userRepostory.findOne({ where: { userid: req.user.userid }, relations: ['games', 'games.game'] });
    if (!user) throw new UnauthorizedException();
    if (user.games.findIndex(g => g.game.gameid) >= 0) throw new ConflictException();
    let relation: UserToGame = new UserToGame(user, game);
    await this.userGameRepostory.save(relation);
    return HttpStatus.CREATED;
  }

  async delete(id: number): Promise<HttpStatus> {
    let game: Game = await this.gameRepostory.findOne({where: {gameid: id}});
    if (!game) throw new NotFoundException();
    await this.gameRepostory.delete(id);
    return HttpStatus.OK;
  }

  async inviteInstitution(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  async deleteInstitutionGame(req: JWTRequest, id: number): Promise<HttpStatus> {
    if (req.user.type != USER_TYPE.INSTITUTION) throw new UnauthorizedException();
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: req.user.entityid }, relations: { user: true } });
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    let game: Game = await await this.gameRepostory.findOne({where: {gameid: id}, relations: ['owner', 'institution']});
    if (!game || game.owner.institutionid != institution.institutionid) throw new NotFoundException();
    await this.gameRepostory.delete(id);
    return HttpStatus.OK;
  }

  // Extra data

  async popularAssets(req: JWTRequest, gameid: number): Promise<Asset[]> {
    if (!await this.userGameRepostory.find({ where: { user: { userid: req.user.userid }, game: { gameid: gameid } }, relations: ['user', 'game'] })) throw new NotFoundException();
    let date = new Date().setTime((new Date().getTime()) - (1000 * 60 * 60 * 24 * 3)); // 3 dias
    let options: any = { where: { instance: { game: { gameid: gameid } }, date: MoreThan(moment(date).format('YYYY-MM-DD HH:MM:ss')) }, relations: ['instance', 'instance.game', 'asset'] };
    let transactions: Transaction[] = await this.transactionRepostory.find(options);
    if (transactions.length <= 0) return [];
    let count = [];
    transactions.forEach(transaction => {
      let assetid = transaction.asset.assetid;
      let index = count.findIndex(a => a.assetid == assetid);
      if (index >= 0) count[index].count++;
      else count.push({assetid: assetid, count: 1});
    });
    let ids: number[] = count.sort((a, b) => b.count - a.count).splice(0, 2).map(object => object.assetid);
    return this.assetRepostory.find({ where: { assetid: In(ids) } });
  }
}

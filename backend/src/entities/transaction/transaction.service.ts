import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { UserToGame } from 'src/relations/entities/user-game.entity';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { Asset } from '../asset/entities/asset.entity';
import { USER_TYPE } from 'src/types/users.type';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepostory: Repository<Transaction>,
    @InjectRepository(UserToGame) private readonly instanceRepostory: Repository<UserToGame>,
    @InjectRepository(Asset) private readonly assetRepostory: Repository<Asset>,
    private dataSource: DataSource
  ) {}

  async create(req: JWTRequest, createTransactionDto: CreateTransactionDto): Promise<HttpStatus> {
    if (req.user.type != USER_TYPE.BASICUSER) throw new UnauthorizedException();
    let instance: UserToGame = await this.instanceRepostory.findOne({ where: { user: { userid: req.user.userid }, game: { gameid: createTransactionDto.gameid } }, relations: { user: { basicuser: true }, game: true, assets: true } });
    if (!instance || !instance.user.basicuser || instance.user.basicuser.basicuserid != req.user.entityid) throw new UnauthorizedException();
    let asset: Asset = await this.assetRepostory.findOne({ where: { assetid: createTransactionDto.assetid }, relations: { currency: true } });
    if (!asset) throw new NotFoundException();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let transaction: Transaction = new Transaction(createTransactionDto, asset, instance);
      instance.makeTransaction(createTransactionDto.action, asset, createTransactionDto.amount);
      await queryRunner.manager.save(transaction);
      await queryRunner.manager.save(instance);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(params: FindTransactionDto): Promise<Transaction[]> {
    return this.transactionRepostory.find({ where: { ...params }, relations: { asset: true, currency: true, instance: { game: true, user: true } } });
  }

  findOne(id: number): Promise<Transaction> {
    return this.transactionRepostory.findOne({ where: { transactionid: id }, relations: { asset: true, currency: true, instance: { game: true, user: true } } });;
  }

  async remove(id: number): Promise<HttpStatus> {
    let transaction: Transaction = await this.findOne(id);
    if (!transaction) throw new NotFoundException();
    return HttpStatus.OK;
  }
}

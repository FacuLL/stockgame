import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { Currency } from '../currency/entities/currency.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserToGame } from 'src/relations/entities/user-game.entity';
import { User } from '../user/entities/user.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Asset } from '../asset/entities/asset.entity';
import { AssetToGame } from 'src/relations/entities/asset-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Institution, Currency, UserToGame, User, Transaction, Asset, AssetToGame]), AuthModule],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}

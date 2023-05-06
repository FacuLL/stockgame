import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { Currency } from '../currency/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Institution, Currency])],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}

import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Institution } from 'src/entities/institution/entities/institution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Institution])],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}

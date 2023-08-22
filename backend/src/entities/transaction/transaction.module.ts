import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToGame } from 'src/relations/entities/user-game.entity';
import { Asset } from '../asset/entities/asset.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, UserToGame, Asset]), AuthModule],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}

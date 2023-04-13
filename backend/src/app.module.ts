import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { ShareModule } from './share/share.module';
import { GameModule } from './game/game.module';
import { BasicuserModule } from './basicuser/basicuser.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'facu',
      database: 'marketgame',
      entities: [],
      synchronize: true,
    }),
    GameModule, UserModule, ShareModule, BasicuserModule, TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

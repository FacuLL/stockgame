import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { ShareModule } from './share/share.module';
import { GameModule } from './game/game.module';
import { BasicuserModule } from './basicuser/basicuser.module';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';
import { PlanModule } from './plan/plan.module';
import { ProviderModule } from './provider/provider.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';

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
    ConfigModule.forRoot(),
    GameModule, UserModule, ShareModule, BasicuserModule, TransactionModule, InstitutionModule, PlanModule, ProviderModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
  }, {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
  }
  ],
})
export class AppModule {}

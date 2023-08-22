import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './entities/transaction/transaction.module';
import { ShareModule } from './entities/share/share.module';
import { GameModule } from './entities/game/game.module';
import { BasicuserModule } from './entities/basicuser/basicuser.module';
import { UserModule } from './entities/user/user.module';
import { InstitutionModule } from './entities/institution/institution.module';
import { PlanModule } from './entities/plan/plan.module';
import { ProviderModule } from './entities/provider/provider.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AssetModule } from './entities/asset/asset.module';
import { RelationsModule } from './relations/relations.module';
import { CurrencyModule } from './entities/currency/currency.module';
import { AdminModule } from './entities/admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { HistoricalassetModule } from './entities/historicalasset/historicalasset.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'facu',
      database: 'marketgame',
      entities: [
        "dist/entities/**/entities/**.entity{.ts,.js}",
        "dist/relations/entities/**.entity{.ts,.js}"
      ],
      synchronize: true
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    GameModule, UserModule, ShareModule, BasicuserModule, TransactionModule, InstitutionModule, PlanModule, ProviderModule, AuthModule, AssetModule, RelationsModule, CurrencyModule, AdminModule, TasksModule, HistoricalassetModule
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

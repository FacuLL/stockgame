import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToGame } from './entities/user-game.entity';
import { AssetToUser } from './entities/asset-user.entity';
import { InstitutionToGame } from './entities/institution-game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserToGame, AssetToUser, InstitutionToGame])]
})
export class RelationsModule {}

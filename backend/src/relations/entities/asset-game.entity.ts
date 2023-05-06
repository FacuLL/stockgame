import { Asset } from "src/entities/asset/entities/asset.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { Game } from "src/entities/game/entities/game.entity";
  
  @Index("assetgameid_UNIQUE", ["assetgameid"], { unique: true })
  @Entity("asset_game", { schema: "marketgame" })
  export class AssetToGame {
    @PrimaryGeneratedColumn()
    assetgameid: number;

    @CreateDateColumn()
    joindate: Date; 

    @ManyToOne(() => Asset, (asset) => asset.games)
    @JoinColumn()
    asset: Asset;

    @ManyToOne(() => Game, (game) => game)
    @JoinColumn()
    game: Game;

    constructor (game: Game, asset: Asset) {
      this.game = game;
      this.asset = asset;
    }
  }
  
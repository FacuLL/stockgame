import { Asset } from "src/entities/asset/entities/asset.entity";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { UserToGame } from "./user-game.entity";
  
  @Index("assetuserid_UNIQUE", ["assetuserid"], { unique: true })
  @Entity("asset_user", { schema: "marketgame" })
  export class AssetToUser {
    @PrimaryGeneratedColumn()
    assetuserid: number;

    @Column({ default: 0 })
    stock: number;
  
    @ManyToOne(() => Asset, {
      cascade: true
    })
    @JoinColumn()
    asset: Asset;

    @ManyToOne(() => UserToGame, {
      cascade: true
    })
    @JoinColumn()
    instance: UserToGame;

    constructor (instance: UserToGame, asset: Asset) {
      this.instance = instance;
      this.asset = asset;
    }
  }
  
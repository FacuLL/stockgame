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
import { ActionType } from "src/types/actions.type";
import { ConflictException } from "@nestjs/common";
  
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

    changeStock(action: ActionType, amount: number) {
      if (action == "sell" && (this.stock < amount)) throw new ConflictException("Not enough stock");
      let operation: number = action == "buy" ? +amount : -amount;
      this.stock+=operation;
    }
  }
  
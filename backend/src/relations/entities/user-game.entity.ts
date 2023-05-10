import { Game } from "src/entities/game/entities/game.entity";
import { User } from "src/entities/user/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { AssetToUser } from "./asset-user.entity";
import { Transaction } from "src/entities/transaction/entities/transaction.entity";
import { ActionType } from "src/types/actions.type";
import { ConflictException } from "@nestjs/common";
import { Asset } from "src/entities/asset/entities/asset.entity";
  
  @Index("usergameid_UNIQUE", ["usergameid"], { unique: true })
  @Entity("user_game", { schema: "marketgame" })
  export class UserToGame {
    @PrimaryGeneratedColumn()
    usergameid: number;
  
    @Column("decimal", { precision: 9, scale: 2, default: 0 })
    cash: number;

    @CreateDateColumn()
    joindate: Date;

    @OneToMany(() => AssetToUser, (assetuser) => assetuser.instance)
    assets: AssetToUser[];

    @OneToMany(() => Transaction, (transaction) => transaction.instance)
    transactions: Transaction[];
  
    @ManyToOne(() => User, (user) => user.games, {
      cascade: true
    })
    @JoinColumn()
    user: User;

    @ManyToOne(() => Game, (game) => game.users, {
      cascade: true
    })
    @JoinColumn()
    game: Game;

    constructor(user: User, game: Game) {
      this.user = user;
      this.game = game;
    }

    makeTransaction(action: ActionType, asset: Asset, amount: number): void {
      let assetinstance: AssetToUser = this.assets.find((assetinstance) => assetinstance.asset.assetid == asset.assetid);
      let mcquotation = this.game.maincurrency.asset.quotation;
      let operation = asset.quotation * asset.currency.asset.quotation * amount / mcquotation;
      if (action == "buy" && operation > this.cash) throw new ConflictException("Not enough cash");
      if (action == "sell" && (!assetinstance || assetinstance.stock < amount)) throw new ConflictException("Not enough stock");
      operation = action == "buy" ? -operation : +operation;
      this.cash+=operation;
      if (assetinstance) return assetinstance.changeStock(action, amount);
      let newassetinstance = new AssetToUser(this, asset);
      newassetinstance.stock = amount;
      this.assets.push(newassetinstance);
    }
  }
  
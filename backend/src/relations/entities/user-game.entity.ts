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

    @OneToMany(() => AssetToUser, (assetuser) => assetuser.instance, {
      cascade: ['insert', 'update']
    })
    assets: AssetToUser[];

    @OneToMany(() => Transaction, (transaction) => transaction.instance)
    transactions: Transaction[];
  
    @ManyToOne(() => User, (user) => user.games, {
      cascade: ['insert', 'update']
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
      this.joindate = new Date;
      if (game) this.cash = game.initialCash;
    }

    getCash(): number {
      let cash: any = this.cash;
      return parseFloat(cash);
    }

    makeTransaction(action: ActionType, asset: Asset, amount: number): void {
      let index: number = this.assets.findIndex((a) => a.asset.assetid == asset.assetid);
      let mcquotation = parseFloat(this.game.maincurrency.asset.quotation);
      let operation = parseFloat(asset.quotation) * parseFloat(asset.currency.asset.quotation) * amount / mcquotation;
      if (action == "buy" && operation > this.cash) throw new ConflictException("Not enough cash");
      if (action == "sell" && (index < 0 || this.assets[index].stock < amount)) throw new ConflictException("Not enough stock");
      operation = action == "buy" ? -operation : +operation;
      this.cash = this.getCash() + operation;
      if (index >= 0) return this.assets[index].changeStock(action, amount);
      let newassetinstance = new AssetToUser(this, asset);
      newassetinstance.changeStock(action, amount)
      this.assets.push(newassetinstance);
    }
  }
  
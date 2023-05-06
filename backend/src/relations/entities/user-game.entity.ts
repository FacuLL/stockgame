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
  }
  
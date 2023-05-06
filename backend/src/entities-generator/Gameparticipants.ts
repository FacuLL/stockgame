import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Commoditystock } from "./Commoditystock";
import { Commoditytransaction } from "./Commoditytransaction";
import { Currencystock } from "./Currencystock";
import { Currencytransaction } from "./Currencytransaction";
import { Game } from "./Game";
import { User } from "../user/entities/user.entity";
import { Sharestock } from "./Sharestock"; 
import { Transaction } from "../transaction/entities/transaction.entity";

@Index("instanceid_UNIQUE", ["instanceid"], { unique: true })
@Index("g_part_game_idx", ["gameid"], {})
@Index("g_part_user_idx", ["userid"], {})
@Entity("gameparticipants", { schema: "marketgame" })
export class Gameparticipants {
  @PrimaryGeneratedColumn({ type: "int", name: "instanceid" })
  instanceid: number;

  @Column("int", { name: "gameid" })
  gameid: number;

  @Column("int", { name: "userid" })
  userid: number;

  @Column("decimal", { name: "cash", precision: 9, scale: 2 })
  cash: string;

  @OneToMany(() => Commoditystock, (commoditystock) => commoditystock.instance)
  commoditystocks: Commoditystock[];

  @OneToMany(
    () => Commoditytransaction,
    (commoditytransaction) => commoditytransaction.instance
  )
  commoditytransactions: Commoditytransaction[];

  @OneToMany(() => Currencystock, (currencystock) => currencystock.instance)
  currencystocks: Currencystock[];

  @OneToMany(
    () => Currencytransaction,
    (currencytransaction) => currencytransaction.instance
  )
  currencytransactions: Currencytransaction[];

  @ManyToOne(() => Game, (game) => game.gameparticipants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gameid", referencedColumnName: "gameid" }])
  game: Game;

  @ManyToOne(() => User, (user) => user.gameparticipants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: User;

  @OneToMany(() => Sharestock, (sharestock) => sharestock.instance)
  sharestocks: Sharestock[];

  @OneToMany(() => Transaction, (transaction) => transaction.instance)
  transactions: Transaction[];
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Currency } from "./Currency";
import { Game } from "./Game";
import { Currencystock } from "./Currencystock";
import { Currencytransaction } from "./Currencytransaction";
import { Transaction } from "../transaction/entities/transaction.entity";

@Index("curr_game_currcode_idx", ["currencycode"], {})
@Index("curr_game_game_idx", ["gameid"], {})
@Entity("currencyingame", { schema: "marketgame" })
export class Currencyingame {
  @Column("varchar", { name: "currencycode", length: 4 })
  currencycode: string;

  @Column("int", { name: "gameid" })
  gameid: number;

  @ManyToOne(() => Currency, (currency) => currency.currencyingames, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "currencycode", referencedColumnName: "code" }])
  currencycode2: Currency;

  @ManyToOne(() => Game, (game) => game.currencyingames, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gameid", referencedColumnName: "gameid" }])
  game: Game;

  @OneToMany(
    () => Currencystock,
    (currencystock) => currencystock.currencycode2
  )
  currencystocks: Currencystock[];

  @OneToMany(
    () => Currencytransaction,
    (currencytransaction) => currencytransaction.currencycode2
  )
  currencytransactions: Currencytransaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.currencycode2)
  transactions: Transaction[];
}

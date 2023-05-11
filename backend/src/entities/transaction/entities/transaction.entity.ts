import { Asset } from "src/entities/asset/entities/asset.entity";
import { UserToGame } from "src/relations/entities/user-game.entity";
import { ActionType } from "src/types/actions.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { Currency } from "src/entities/currency/entities/currency.entity";

@Index("transactionid_UNIQUE", ["transactionid"], { unique: true })
@Entity("transaction", { schema: "marketgame" })
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionid: number;

  @CreateDateColumn()
  date: Date;

  @Column("decimal", { precision: 9, scale: 2 })
  quotation: number;

  @Column("varchar")
  action: ActionType;

  @Column()
  amount: number;

  @ManyToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  @ManyToOne(() => Currency)
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => UserToGame, (usergame) => usergame.transactions)
  @JoinColumn()
  instance: UserToGame;

  constructor(data: CreateTransactionDto, asset: Asset, instance: UserToGame) {
    if (data && asset && instance) {
      for (let property in data) {
        this[property] = data[property];
      }
      this.asset = asset;
      this.currency = asset.currency;
      this.instance = instance;
      this.date = new Date();
      this.quotation = this.asset.quotation;
    }
  }
}

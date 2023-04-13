import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currencyingame } from "../../../../../output/entities/Currencyingame";
import { Gameparticipants } from "../../../../../output/entities/Gameparticipants";
import { Shareingame } from "../../../../../output/entities/Shareingame";

@Index("transid_UNIQUE", ["transid"], { unique: true })
@Index("trans_user_idx", ["instanceid"], {})
@Index("trans_currency_idx", ["currencycode"], {})
@Index("trans_share_idx", ["sharecode"], {})
@Entity("transaction", { schema: "marketgame" })
export class Transaction {
  @PrimaryGeneratedColumn({ type: "int", name: "transid" })
  transid: number;

  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("varchar", { name: "sharecode", length: 10 })
  sharecode: string;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", {
    name: "quotation",
    precision: 9,
    scale: 2,
    default: () => "'0.00'",
  })
  quotation: string;

  @Column("varchar", { name: "action", length: 4, default: () => "'buy'" })
  action: string;

  @Column("varchar", {
    name: "currencycode",
    length: 3,
    default: () => "'ARS'",
  })
  currencycode: string;

  @Column("int", { name: "amount", default: () => "'1'" })
  amount: number;

  @ManyToOne(
    () => Currencyingame,
    (currencyingame) => currencyingame.transactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "currencycode", referencedColumnName: "currencycode" }])
  currencycode2: Currencyingame;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.transactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;

  @ManyToOne(() => Shareingame, (shareingame) => shareingame.transactions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sharecode", referencedColumnName: "sharecode" }])
  sharecode2: Shareingame;
}

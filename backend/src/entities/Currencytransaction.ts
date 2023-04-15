import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Currencyingame } from "./Currencyingame";
import { Gameparticipants } from "./Gameparticipants";

@Index("currtransid_UNIQUE", ["currtransid"], { unique: true })
@Index("curr_trans_currcode_idx", ["currencycode"], {})
@Index("curr_trans_instance_idx", ["instanceid"], {})
@Entity("currencytransaction", { schema: "marketgame" })
export class Currencytransaction {
  @PrimaryGeneratedColumn({ type: "int", name: "currtransid" })
  currtransid: number;

  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", { name: "quotation", precision: 9, scale: 2 })
  quotation: string;

  @Column("varchar", { name: "action", length: 4, default: () => "'buy'" })
  action: string;

  @Column("varchar", { name: "currencycode", length: 4 })
  currencycode: string;

  @Column("decimal", { name: "amount", precision: 9, scale: 2 })
  amount: string;

  @ManyToOne(
    () => Currencyingame,
    (currencyingame) => currencyingame.currencytransactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "currencycode", referencedColumnName: "currencycode" }])
  currencycode2: Currencyingame;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.currencytransactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;
}

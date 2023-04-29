import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Currencyingame } from "./Currencyingame";
import { Gameparticipants } from "./Gameparticipants";

@Index("curr_stock_instance_idx", ["instanceid"], {})
@Index("curr_stock_currency_idx", ["currencycode"], {})
@Entity("currencystock", { schema: "marketgame" })
export class Currencystock {
  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("varchar", { name: "currencycode", length: 4 })
  currencycode: string;

  @Column("decimal", { name: "stock", precision: 9, scale: 2 })
  stock: string;

  @ManyToOne(
    () => Currencyingame,
    (currencyingame) => currencyingame.currencystocks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "currencycode", referencedColumnName: "currencycode" }])
  currencycode2: Currencyingame;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.currencystocks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;
}

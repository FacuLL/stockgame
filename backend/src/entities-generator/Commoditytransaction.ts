import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Commodityingame } from "./Commodityingame";
import { Gameparticipants } from "./Gameparticipants";

@Index("comtrans_comid_idx", ["commodityid"], {})
@Index("comtrans_instance_idx", ["instanceid"], {})
@Entity("commoditytransaction", { schema: "marketgame" })
export class Commoditytransaction {
  @Column("int", { primary: true, name: "comtransid" })
  comtransid: number;

  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", { name: "quotation", precision: 9, scale: 2 })
  quotation: string;

  @Column("varchar", { name: "action", length: 4 })
  action: string;

  @Column("int", { name: "commodityid" })
  commodityid: number;

  @Column("int", { name: "amount" })
  amount: number;

  @ManyToOne(
    () => Commodityingame,
    (commodityingame) => commodityingame.commoditytransactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "commodityid", referencedColumnName: "commodityid" }])
  commodity: Commodityingame;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.commoditytransactions,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;
}

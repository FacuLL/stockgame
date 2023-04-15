import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Commodityingame } from "./Commodityingame";
import { Gameparticipants } from "./Gameparticipants";

@Index("comstock_instance_idx", ["instanceid"], {})
@Index("comstock_com_idx", ["commodityid"], {})
@Entity("commoditystock", { schema: "marketgame" })
export class Commoditystock {
  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("int", { name: "commodityid" })
  commodityid: number;

  @Column("int", { name: "stock" })
  stock: number;

  @ManyToOne(
    () => Commodityingame,
    (commodityingame) => commodityingame.commoditystocks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "commodityid", referencedColumnName: "commodityid" }])
  commodity: Commodityingame;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.commoditystocks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;
}

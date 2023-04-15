import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Commodity } from "./Commodity";

@Index("hiscom_com_idx", ["commodityid"], {})
@Entity("historicalcommodity", { schema: "marketgame" })
export class Historicalcommodity {
  @Column("int", { name: "commodityid" })
  commodityid: number;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", { name: "open", precision: 9, scale: 2 })
  open: string;

  @Column("decimal", { name: "close", precision: 9, scale: 2 })
  close: string;

  @Column("decimal", { name: "high", precision: 9, scale: 2 })
  high: string;

  @Column("decimal", { name: "low", precision: 9, scale: 2 })
  low: string;

  @Column("decimal", { name: "volume", precision: 9, scale: 2 })
  volume: string;

  @ManyToOne(() => Commodity, (commodity) => commodity.historicalcommodities, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "commodityid", referencedColumnName: "commodityid" }])
  commodity: Commodity;
}

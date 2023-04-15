import { Column, Entity, OneToMany } from "typeorm";
import { Commodityingame } from "./Commodityingame";
import { Historicalcommodity } from "./Historicalcommodity";

@Entity("commodity", { schema: "marketgame" })
export class Commodity {
  @Column("int", { primary: true, name: "commodityid" })
  commodityid: number;

  @Column("decimal", { name: "quotation", precision: 9, scale: 2 })
  quotation: string;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("varchar", { name: "image", nullable: true, length: 45 })
  image: string | null;

  @Column("tinyint", { name: "automatized", width: 1 })
  automatized: boolean;

  @Column("tinyint", { name: "available", width: 1 })
  available: boolean;

  @Column("varchar", { name: "endpoint", nullable: true, length: 45 })
  endpoint: string | null;

  @Column("varchar", { name: "code", nullable: true, length: 4 })
  code: string | null;

  @OneToMany(
    () => Commodityingame,
    (commodityingame) => commodityingame.commodity
  )
  commodityingames: Commodityingame[];

  @OneToMany(
    () => Historicalcommodity,
    (historicalcommodity) => historicalcommodity.commodity
  )
  historicalcommodities: Historicalcommodity[];
}

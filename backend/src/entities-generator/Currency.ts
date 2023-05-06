import { Column, Entity, Index, OneToMany } from "typeorm";
import { Currencyingame } from "./Currencyingame";
import { Historicalcurrency } from "./Historicalcurrency";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("currency", { schema: "marketgame" })
export class Currency2 {
  @Column("varchar", { primary: true, name: "code", length: 4 })
  code: string;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("decimal", {
    name: "quotation",
    precision: 9,
    scale: 2,
    default: () => "'0.00'",
  })
  quotation: string;

  @Column("varchar", { name: "image", nullable: true, length: 45 })
  image: string | null;

  @Column("tinyint", { name: "automatized", width: 1, default: () => "'1'" })
  automatized: boolean;

  @Column("tinyint", { name: "available", width: 1 })
  available: boolean;

  @Column("varchar", { name: "endpoint", nullable: true, length: 60 })
  endpoint: string | null;

  @OneToMany(
    () => Currencyingame,
    (currencyingame) => currencyingame.currencycode2
  )
  currencyingames: Currencyingame[];

  @OneToMany(
    () => Historicalcurrency,
    (historicalcurrency) => historicalcurrency.currencycode2
  )
  historicalcurrencies: Historicalcurrency[];
}

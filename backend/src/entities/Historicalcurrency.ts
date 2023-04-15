import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Currency } from "./Currency";

@Index("hiscurr_curr_idx", ["currencycode"], {})
@Entity("historicalcurrency", { schema: "marketgame" })
export class Historicalcurrency {
  @Column("varchar", { name: "currencycode", length: 4 })
  currencycode: string;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", { name: "quotation", precision: 9, scale: 2 })
  quotation: string;

  @ManyToOne(() => Currency, (currency) => currency.historicalcurrencies, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "currencycode", referencedColumnName: "code" }])
  currencycode2: Currency;
}

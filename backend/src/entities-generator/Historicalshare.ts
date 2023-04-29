import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Share } from "./Share";

@Index("hisshare_share_idx", ["sharecode"], {})
@Entity("historicalshare", { schema: "marketgame" })
export class Historicalshare {
  @Column("varchar", { name: "sharecode", length: 10 })
  sharecode: string;

  @Column("datetime", { name: "date" })
  date: Date;

  @Column("decimal", { name: "open", precision: 9, scale: 2 })
  open: string;

  @Column("decimal", { name: "close", precision: 9, scale: 2 })
  close: string;

  @Column("decimal", { name: "volume", precision: 9, scale: 2 })
  volume: string;

  @Column("decimal", { name: "high", precision: 9, scale: 2 })
  high: string;

  @Column("decimal", { name: "low", precision: 9, scale: 2 })
  low: string;

  @ManyToOne(() => Share, (share) => share.historicalshares, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sharecode", referencedColumnName: "code" }])
  sharecode2: Share;
}

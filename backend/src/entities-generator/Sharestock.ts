import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Gameparticipants } from "./Gameparticipants";
import { Shareingame } from "./Shareingame";

@Index("share_stock_instance_idx", ["instanceid"], {})
@Index("share_stock_sharecode_idx", ["sharecode"], {})
@Entity("sharestock", { schema: "marketgame" })
export class Sharestock {
  @Column("int", { name: "instanceid" })
  instanceid: number;

  @Column("varchar", { name: "sharecode", length: 10 })
  sharecode: string;

  @Column("int", { name: "stock", default: () => "'0'" })
  stock: number;

  @ManyToOne(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.sharestocks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "instanceid", referencedColumnName: "instanceid" }])
  instance: Gameparticipants;

  @ManyToOne(() => Shareingame, (shareingame) => shareingame.sharestocks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sharecode", referencedColumnName: "sharecode" }])
  sharecode2: Shareingame;
}

import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Historicalshare } from "../../entities/Historicalshare";
import { Game } from "src/game/entities/game.entity";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("share", { schema: "marketgame" })
export class Share {
  @PrimaryColumn("varchar", { name: "code", length: 10 })
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

  @Column("tinyint", { name: "automatized", width: 1, default: () => "'1'" })
  automatized: boolean;

  @Column("varchar", { name: "currency", length: 3, default: () => "'ars'" })
  currency: string;

  @Column("varchar", { name: "image", nullable: true, length: 45 })
  image: string | null;

  @Column("tinyint", { name: "available", width: 1 })
  available: boolean;

  @Column("varchar", { name: "endpoint", nullable: true, length: 60 })
  endpoint: string | null;

  @Column("decimal", { name: "dayhigh", precision: 9, scale: 2 })
  dayhigh: string;

  @Column("decimal", { name: "daylow", precision: 9, scale: 2 })
  daylow: string;

  @OneToMany(
    () => Historicalshare,
    (historicalshare) => historicalshare.sharecode2
  )
  historicalshares: Historicalshare[];

  @ManyToMany(() => Game)
  @JoinTable()
  games: Game[];
}

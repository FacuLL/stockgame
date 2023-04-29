import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Game } from "src/entities/game/entities/game.entity";
import { fields } from "src/constants/fields.constants";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("share", { schema: "marketgame" })
export class Share {
  @PrimaryColumn({ length: 10 })
  code: string;

  @Column({ length: fields.name.max })
  name: string;

  @Column("decimal", { precision: 9, scale: 2, })
  quotation: number;

  @Column()
  automatized: boolean;

  // @Column("varchar", { name: "currency", length: 3, default: () => "'ars'" })
  // currency: string;

  @Column("varchar", { nullable: true })
  image?: string;

  @Column()
  available: boolean;

  @Column({ precision: 9, scale: 2 })
  dayhigh: string;

  @Column({ precision: 9, scale: 2 })
  daylow: string;

  @Column({ type: 'timestamptz' })
  lastupdate: Date;

  // @OneToMany(() => Historicalshare, (historicalshare) => historicalshare.sharecode2)
  // historicalshares: Historicalshare[];

  @ManyToMany(() => Game)
  @JoinTable()
  games: Game[];
}

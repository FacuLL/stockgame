import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "src/entities/game/entities/game.entity";
import { fields } from "src/constants/fields.constants";
import { AssetToGame } from "src/relations/entities/asset-game.entity";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("asset", { schema: "marketgame" })
export class Asset {
  @PrimaryGeneratedColumn()
  assetid: number;

  @Column()
  code: string;

  @Column({ length: fields.name.max })
  name: string;

  @Column("decimal", { precision: 9, scale: 2, })
  quotation: number;

  @Column()
  automatized: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column()
  available: boolean;

  @Column({ precision: 9, scale: 2 })
  dayhigh: string;

  @Column({ precision: 9, scale: 2 })
  daylow: string;

  @CreateDateColumn()
  lastupdate: Date;

  // @OneToMany(() => Historicalshare, (historicalshare) => historicalshare.sharecode2)
  // historicalshares: Historicalshare[];

  @OneToMany(() => AssetToGame, (assetgame) => assetgame.asset)
  games: AssetToGame[];
}

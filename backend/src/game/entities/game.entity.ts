import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Commodityingame } from "../../../../../output/entities/Commodityingame";
import { Currencyingame } from "../../../../../output/entities/Currencyingame";
import { Gameparticipants } from "../../../../../output/entities/Gameparticipants";
import { Shareingame } from "../../../../../output/entities/Shareingame";

@Index("gameid_UNIQUE", ["gameid"], { unique: true })
@Entity("game", { schema: "marketgame" })
export class Game {
  @PrimaryGeneratedColumn({ type: "int", name: "gameid" })
  gameid: number;

  @Column("varchar", { name: "title", length: 45 })
  title: string;

  @Column("date", { name: "startDate" })
  startDate: string;

  @Column("date", { name: "finishDate", nullable: true })
  finishDate: string | null;

  @Column("tinyint", { name: "finished", width: 1, default: () => "'0'" })
  finished: boolean;

  @Column("decimal", { name: "initialCash", precision: 9, scale: 2 })
  initialCash: string;

  @OneToMany(() => Commodityingame, (commodityingame) => commodityingame.game)
  commodityingames: Commodityingame[];

  @OneToMany(() => Currencyingame, (currencyingame) => currencyingame.game)
  currencyingames: Currencyingame[];

  @OneToMany(
    () => Gameparticipants,
    (gameparticipants) => gameparticipants.game
  )
  gameparticipants: Gameparticipants[];

  @OneToMany(() => Shareingame, (shareingame) => shareingame.game)
  shareingames: Shareingame[];
}

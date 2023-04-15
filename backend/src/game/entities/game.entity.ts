import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Commodityingame } from "../../entities/Commodityingame";
import { Currencyingame } from "../../entities/Currencyingame";
import { Gameparticipants } from "../../entities/Gameparticipants";
import { Shareingame } from "../../entities/Shareingame";
import { User } from "src/user/entities/user.entity";
import { Share } from "src/share/entities/share.entity";

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

  @ManyToMany(() => Share, (share) => share.games)
  shares: Share[];

  @ManyToMany(() => User)
  participants: User[];

  // @OneToMany(() => Commodityingame, (commodityingame) => commodityingame.game)
  // commodityingames: Commodityingame[];

  // @OneToMany(() => Currencyingame, (currencyingame) => currencyingame.game)
  // currencyingames: Currencyingame[];
}

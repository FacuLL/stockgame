import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Share } from "src/share/entities/share.entity";
import { Institution } from "src/institution/entities/institution.entity";
import { CreateGameDto } from "../dto/create-game.dto";

@Index("gameid_UNIQUE", ["gameid"], { unique: true })
@Entity("game", { schema: "marketgame" })
export class Game {
  @PrimaryGeneratedColumn()
  gameid: number;

  @Column({ length: 45 })
  title: string;

  @Column("date")
  startDate: string;

  @Column("date", { nullable: true })
  finishDate?: string;

  @Column({ width: 1, default: () => "'0'" })
  finished: boolean;

  @Column({ precision: 9, scale: 2 })
  initialCash: number;

  @ManyToMany(() => Share, (share) => share.games)
  shares: Share[];

  @ManyToMany(() => Institution, (institution) => institution.games)
  institutions: Institution[];

  @ManyToOne(() => Institution)
  owner: Institution;

  constructor(data: CreateGameDto) {
    for (let property in data) {
      this[property] = data[property];
    }
  }

  isFinished() {
    return this.finished || (this.finishDate && new Date(this.finishDate) <= new Date());
  }

  // @OneToMany(() => Commodityingame, (commodityingame) => commodityingame.game)
  // commodityingames: Commodityingame[];

  // @OneToMany(() => Currencyingame, (currencyingame) => currencyingame.game)
  // currencyingames: Currencyingame[];

}

import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Share } from "src/entities/share/entities/share.entity";
import { Institution } from "src/entities/institution/entities/institution.entity";
import { CreateGameDto } from "../dto/create-game.dto";
import { fields } from "src/constants/fields.constants";
import { BadRequestException } from "@nestjs/common";
import { UpdateGameDto } from "../dto/update-game.dto";

@Index("gameid_UNIQUE", ["gameid"], { unique: true })
@Entity("game", { schema: "marketgame" })
export class Game {
  @PrimaryGeneratedColumn()
  gameid: number;

  @Column({ length: fields.title.max })
  title: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishDate?: Date;

  @Column({ default: false })
  finished: boolean;

  @Column({ precision: 9, scale: 2 })
  initialCash: number;

  @Column()
  global: boolean;

  @ManyToMany(() => Share, (share) => share.games)
  shares: Share[];

  @ManyToMany(() => Institution, (institution) => institution.games)
  institutions?: Institution[];

  @ManyToOne(() => Institution)
  owner?: Institution;

  constructor(data: CreateGameDto, global: boolean, institution?: Institution) {
    for (let property in data) {
      this[property] = data[property];
    }
    if (!global && !institution) throw new BadRequestException();
    else if (!global && institution) {
      this.institutions = [institution];
      this.owner = institution;
    }
    this.startDate = new Date();
  }

  hasFinished() {
    return this.finished || (this.finishDate && new Date(this.finishDate) <= new Date());
  }

  updateData(data: UpdateGameDto) {
    for (let property in data) {
      this[property] = data[property];
    }
  }

  // @OneToMany(() => Commodityingame, (commodityingame) => commodityingame.game)
  // commodityingames: Commodityingame[];

  // @OneToMany(() => Currencyingame, (currencyingame) => currencyingame.game)
  // currencyingames: Currencyingame[];

}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Institution } from "src/entities/institution/entities/institution.entity";
import { CreateGameDto } from "../dto/create-game.dto";
import { fields } from "src/constants/fields.constants";
import { BadRequestException } from "@nestjs/common";
import { UpdateGameDto } from "../dto/update-game.dto";
import { UserToGame } from "src/relations/entities/user-game.entity";
import { InstitutionToGame } from "src/relations/entities/institution-game.entity";
import { AssetToGame } from "src/relations/entities/asset-game.entity";
import { Currency } from "src/entities/currency/entities/currency.entity";

@Index("gameid_UNIQUE", ["gameid"], { unique: true })
@Entity("game", { schema: "marketgame" })
export class Game {
  @PrimaryGeneratedColumn()
  gameid: number;

  @Column({ length: fields.title.max })
  title: string;

  @CreateDateColumn()
  startDate: Date;

  @CreateDateColumn({ nullable: true })
  finishDate?: Date;

  @Column({ default: false })
  finished: boolean;

  @Column("decimal", { precision: 9, scale: 2 })
  initialCash: number;

  @Column({ default: false })
  global: boolean;

  @Column({ nullable: true })
  currencysymbol?: string;

  @ManyToOne(() => Institution, (institution) => institution.ownergames)
  @JoinColumn()
  owner?: Institution;

  @ManyToOne(() => Currency)
  @JoinColumn()
  maincurrency: Currency;

  @OneToMany(() => AssetToGame, (assetgame) => assetgame.game)
  assets: AssetToGame[];

  @OneToMany(() => InstitutionToGame, (institutiongame) => institutiongame.institution)
  institutions?: InstitutionToGame[];

  @OneToMany(() => UserToGame, (usertogame) => usertogame.game)
  users: UserToGame[];

  popularassets: AssetToGame[];

  constructor(data: CreateGameDto, global: boolean, maincurrency: Currency, institution?: Institution) {
    if (data) {
      for (let property in data) {
        this[property] = data[property];
      }
      if (!global && !institution) throw new BadRequestException();
      else if (!global && institution) {
        this.institutions = [new InstitutionToGame(institution, this)];
        this.owner = institution;
      }
      this.startDate = new Date();
      this.maincurrency = maincurrency;
      this.global = global;
      if (!data.currencysymbol) this.currencysymbol = "$";
      if (!data.finishDate) this.finishDate = null;
    }
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

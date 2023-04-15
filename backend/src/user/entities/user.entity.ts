import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Basicuser } from "../../basicuser/entities/basicuser.entity";
import { Gameparticipants } from "../../entities/Gameparticipants";
import { Team } from "../../entities/Team";
import { Game } from "src/game/entities/game.entity";

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Entity("user", { schema: "marketgame" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "userid" })
  userid: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("varchar", { name: "image", nullable: true, length: 45 })
  image: string | null;

  @Column("tinyint", { name: "team", width: 1, default: () => "'0'" })
  team: boolean;

  @Column("tinyint", { name: "publicprofile", width: 1, default: () => "'0'" })
  publicprofile: boolean;

  @OneToOne(() => Basicuser, (basicuser) => basicuser.user)
  basicuser: Basicuser;

  @ManyToMany(() => Game)
  @JoinTable()
  games: Game[];

  // @OneToMany(() => Team, (team) => team.creator)
  // teams: Team[];

  // @OneToOne(() => Team, (team) => team.user)
  // team2: Team;
}

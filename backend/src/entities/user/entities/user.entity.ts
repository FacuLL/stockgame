import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Institution } from "src/entities/institution/entities/institution.entity";
import { BasicUser } from "src/entities/basicuser/entities/basicuser.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserType } from "src/types/users.type";
import { UserToGame } from "src/relations/entities/user-game.entity";

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Entity("user", { schema: "marketgame" })
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({ length: 45 })
  name: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: false })
  publicprofile: boolean;

  @Column("varchar")
  type: UserType;

  @OneToOne(() => Institution, (institution) => institution.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  institution: Institution;

  @OneToOne(() => BasicUser, (basicuser) => basicuser.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  basicuser: BasicUser;

  @OneToMany(() => UserToGame, (usertogame) => usertogame.user)
  games: UserToGame[];

  constructor(data: CreateUserDto, type: UserType) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.type = type;
  }

  updateData(data: UpdateUserDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }

  // @Column("tinyint", { name: "team", width: 1, default: () => "'0'" })
  // isTeam: boolean;

  // @OneToMany(() => Team, (team) => team.creator)
  // teams: Team[];

  // @OneToOne(() => Team, (team) => team.user)
  // team2: Team;
}

import {
  Column,
  Entity,
  Index,
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
import { Admin } from "src/entities/admin/entities/admin.entity";

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

  @OneToOne(() => Institution, (institution) => institution.user)
  institution: Institution;

  @OneToOne(() => BasicUser, (basicuser) => basicuser.user)
  basicuser: BasicUser;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

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

  // @OneToOne(() => Team, (team) => team.user)
  // team2: Team;
}

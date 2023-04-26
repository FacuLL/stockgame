import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Institution } from "src/institution/entities/institution.entity";
import { BasicUser } from "src/basicuser/entities/basicuser.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserType } from "src/types/users.type";

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Entity("user", { schema: "marketgame" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "userid" })
  userid: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("varchar", { name: "image", nullable: true, length: 45 })
  image: string | null;

  @Column("tinyint", { name: "publicprofile", width: 1, default: () => "'0'" })
  publicprofile: boolean;

  @Column("varchar", {length: 15})
  type: UserType;

  @OneToOne(() => Institution, (institution) => institution.user)
  institution: Institution;

  @OneToOne(() => BasicUser, (basicuser) => basicuser.user)
  basicuser: BasicUser;

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

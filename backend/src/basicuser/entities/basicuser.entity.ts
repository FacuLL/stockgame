import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { Teaminvitations } from "../../entities/Teaminvitations";
import { Teamparticipants } from "../../entities/Teamparticipants";

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Index("bUser_user", ["userid"], {})
@Entity("basicuser", { schema: "marketgame" })
export class Basicuser {
  @Column("int", { name: "userid", unique: true })
  userid: number;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("int", { name: "dni" })
  dni: number;

  @Column("tinyint", { name: "admin", width: 1, default: () => "'0'" })
  admin: boolean;

  @Column("varchar", { name: "password", length: 60 })
  password: string;

  @Column("varchar", { primary: true, name: "username", length: 45 })
  username: string;

  @OneToOne(() => User, (user) => user.basicuser, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: User;

  @OneToMany(() => Teaminvitations, (teaminvitations) => teaminvitations.user)
  teaminvitations: Teaminvitations[];

  @OneToMany(
    () => Teamparticipants,
    (teamparticipants) => teamparticipants.user
  )
  teamparticipants: Teamparticipants[];
}

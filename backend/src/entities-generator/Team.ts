import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Teaminvitations } from "./Teaminvitations";
import { Teamparticipants } from "./Teamparticipants";

@Index("teamid_UNIQUE", ["teamid"], { unique: true })
@Index("userid_UNIQUE", ["userid"], { unique: true })
@Index("team_creator_idx", ["creatorid"], {})
@Index("team_userid_idx", ["userid"], {})
@Entity("team", { schema: "marketgame" })
export class Team {
  @PrimaryGeneratedColumn({ type: "int", name: "teamid" })
  teamid: number;

  @Column("int", { name: "userid", unique: true })
  userid: number;

  @Column("int", { name: "creatorid" })
  creatorid: number;

  @ManyToOne(() => User, (user) => user.teams, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "creatorid", referencedColumnName: "userid" }])
  creator: User;

  @OneToOne(() => User, (user) => user.team2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: User;

  @OneToMany(() => Teaminvitations, (teaminvitations) => teaminvitations.team)
  teaminvitations: Teaminvitations[];

  @OneToMany(
    () => Teamparticipants,
    (teamparticipants) => teamparticipants.team
  )
  teamparticipants: Teamparticipants[];
}

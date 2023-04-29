import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Team } from "./Team";
import { Basicuser } from "../basicuser/entities/basicuser.entity";

@Index("t_part_team_idx", ["teamid"], {})
@Index("t_part_user_idx", ["userid"], {})
@Entity("teamparticipants", { schema: "marketgame" })
export class Teamparticipants {
  @Column("int", { name: "teamid" })
  teamid: number;

  @Column("int", { name: "userid" })
  userid: number;

  @ManyToOne(() => Team, (team) => team.teamparticipants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "teamid", referencedColumnName: "teamid" }])
  team: Team;

  @ManyToOne(() => Basicuser, (basicuser) => basicuser.teamparticipants, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: Basicuser;
}

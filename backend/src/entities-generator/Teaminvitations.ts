import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Team } from "./Team";
import { Basicuser } from "../basicuser/entities/basicuser.entity";

@Index("teaminv_team_idx", ["teamid"], {})
@Index("teaminv_user_idx", ["userid"], {})
@Entity("teaminvitations", { schema: "marketgame" })
export class Teaminvitations {
  @Column("int", { name: "teamid" })
  teamid: number;

  @Column("int", { name: "userid" })
  userid: number;

  @ManyToOne(() => Team, (team) => team.teaminvitations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "teamid", referencedColumnName: "teamid" }])
  team: Team;

  @ManyToOne(() => Basicuser, (basicuser) => basicuser.teaminvitations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userid", referencedColumnName: "userid" }])
  user: Basicuser;
}

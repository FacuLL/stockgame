import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Commodity } from "./Commodity";
// import { Game } from "./Game";
import { Commoditystock } from "./Commoditystock";
import { Commoditytransaction } from "./Commoditytransaction";

@Index("com_game_com_idx", ["commodityid"], {})
@Index("com_game_game_idx", ["gameid"], {})
@Entity("commodityingame", { schema: "marketgame" })
export class Commodityingame {
  @Column("int", { name: "commodityid" })
  commodityid: number;

  @Column("int", { name: "gameid" })
  gameid: number;

  @ManyToOne(() => Commodity, (commodity) => commodity.commodityingames, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "commodityid", referencedColumnName: "commodityid" }])
  commodity: Commodity;

  // @ManyToOne(() => Game, (game) => game.commodityingames, {
  //   onDelete: "NO ACTION",
  //   onUpdate: "NO ACTION",
  // })
  // @JoinColumn([{ name: "gameid", referencedColumnName: "gameid" }])
  // game: Game;

  @OneToMany(() => Commoditystock, (commoditystock) => commoditystock.commodity)
  commoditystocks: Commoditystock[];

  @OneToMany(
    () => Commoditytransaction,
    (commoditytransaction) => commoditytransaction.commodity
  )
  commoditytransactions: Commoditytransaction[];
}

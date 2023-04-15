import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Game } from "./Game";
import { Share } from "../share/entities/share.entity";
import { Sharestock } from "./Sharestock";
import { Transaction } from "../transaction/entities/transaction.entity";

@Index("share_game_sharecode_idx", ["sharecode"], {})
@Index("share_game_gameid_idx", ["gameid"], {})
@Entity("shareingame", { schema: "marketgame" })
export class Shareingame {
  @Column("varchar", { name: "sharecode", length: 10 })
  sharecode: string;

  @Column("int", { name: "gameid" })
  gameid: number;

  @ManyToOne(() => Game, (game) => game.shareingames, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "gameid", referencedColumnName: "gameid" }])
  game: Game;

  @ManyToOne(() => Share, (share) => share.shareingames, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sharecode", referencedColumnName: "code" }])
  sharecode2: Share;

  @OneToMany(() => Sharestock, (sharestock) => sharestock.sharecode2)
  sharestocks: Sharestock[];

  @OneToMany(() => Transaction, (transaction) => transaction.sharecode2)
  transactions: Transaction[];
}

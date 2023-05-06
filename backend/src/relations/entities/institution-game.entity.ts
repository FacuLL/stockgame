import { Asset } from "src/entities/asset/entities/asset.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { UserToGame } from "./user-game.entity";
import { Institution } from "src/entities/institution/entities/institution.entity";
import { Game } from "src/entities/game/entities/game.entity";
  
  @Index("institutiongameid_UNIQUE", ["institutiongameid"], { unique: true })
  @Entity("institution-game", { schema: "marketgame" }) 
  export class InstitutionToGame {
    @PrimaryGeneratedColumn()
    institutiongameid: number;

    @Column({ default: false })
    accepted: boolean;

    @Column({ default: false })
    admin: boolean;

    @CreateDateColumn()
    invitationdate: Date;

    @CreateDateColumn({ nullable: true })
    joindate?: Date;

    @ManyToOne(() => Institution, (institution) => institution.games, {
      cascade: true
    })
    @JoinColumn()
    institution: Institution;

    @ManyToOne(() => Game, (game) => game.institutions, {
      cascade: true
    })
    @JoinColumn()
    game: Game;

    constructor (institution: Institution, game: Game) {
      this.institution = institution;
      this.game = game;
      this.invitationdate = new Date();
    }

    acceptInvitation(): void {
      this.accepted = true;
      this.joindate = new Date();
    }
  }
  
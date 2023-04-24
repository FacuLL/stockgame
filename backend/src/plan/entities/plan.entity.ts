import {
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "src/user/entities/user.entity";
  import { Game } from "src/game/entities/game.entity";
import { Institution } from "src/institution/entities/institution.entity";
  
  @Index("institutionid_UNIQUE", ["institutionid"], { unique: true })
  @Entity("institution", { schema: "marketgame" })
  export class Plan {
    @PrimaryGeneratedColumn({ type: "int", name: "institutionid" })
    planid: number;
  
    @Column("varchar", { name: "title", length: 45 })
    title: string;

    @Column("decimal", {
        name: "quotation",
        precision: 9,
        scale: 2,
        default: () => "'0.00'",
    })
    price: number;
  
    
  @Column("tinyint", { name: "paid", width: 1, default: () => "'0'" })
    paid: boolean;

    @OneToMany(() => Institution, (institution) => institution.plan)
    institutions: Institution[]

  }
  


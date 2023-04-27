  import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Institution } from "src/institution/entities/institution.entity";
  import { fields } from "src/constants/fields.constants";
  
  @Index("institutionid_UNIQUE", ["institutionid"], { unique: true })
  @Entity("institution", { schema: "marketgame" })
  export class Plan {
    @PrimaryGeneratedColumn()
    planid: number;
  
    @Column({ length: fields.title.max })
    title: string;

    @Column({ precision: 9, scale: 2 })
    price: number;
  
    @Column()
    accounts: number;

    @Column()
    courses: boolean;

    @OneToMany(() => Institution, (institution) => institution.plan)
    institutions: Institution[]

    constructor() {

    }
  }
  


  import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Institution } from "src/entities/institution/entities/institution.entity";
  import { fields } from "src/constants/fields.constants";
import { CreatePlanDto } from "../dto/create-plan.dto";
import { UpdatePlanDto } from "../dto/update-plan.dto";
  
  @Index("planid_UNIQUE", ["planid"], { unique: true })
  @Entity("plan", { schema: "marketgame" })
  export class Plan {
    @PrimaryGeneratedColumn()
    planid: number;
  
    @Column({ length: fields.title.max })
    title: string;

    @Column("decimal", { precision: 9, scale: 2 })
    price: number;
  
    @Column()
    accounts: number;

    @Column()
    courses: boolean;

    @OneToMany(() => Institution, (institution) => institution.plan)
    institutions: Institution[]

    constructor(data: CreatePlanDto) {
      for (let property in data) {
        this[property] = data[property];
      }
    }

    updateData(data: UpdatePlanDto) {
      for (let property in data) {
        this[property] = data[property];
      }
    }
  }
  


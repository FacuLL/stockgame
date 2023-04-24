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
import { Plan } from "src/plan/entities/plan.entity";
import { CreateInstitutionDto } from "../dto/create-institution.dto";
import { UpdateInstitutionDto } from "../dto/update-institution.dto";
  
  @Index("institutionid_UNIQUE", ["institutionid"], { unique: true })
  @Entity("institution", { schema: "marketgame" })
  export class Institution {
    @PrimaryGeneratedColumn()
    institutionid: number;
  
    @Column({ length: 45 })
    name: string;

    @Column({ length: 45, nullable: true })
    email?: string;

    @Column({ length: 60 })
    private password: string;
  
    @Column({ width: 1, default: () => "'0'" })
    paid: boolean;

    @ManyToOne(() => Plan, (plan) => plan.institutions)
    plan: Plan;

    @ManyToMany(() => Game, (game) => game.institutions)
    @JoinTable()
    games: Game[];

    @OneToMany(() => Game, (game) => game.owner)
    ownergames: Game[];
  
    @OneToMany(() => User, (user) => user.institution)
    users: User[];

    constructor(data: CreateInstitutionDto) {
      for (let property in data) {
        this[property] = data[property];
      }
    }

    updateData(data: UpdateInstitutionDto): void {
      for (let property in data) {
        this[property] = data[property];
      }
    }
  
    removeSensibleData(): void {
      delete this.password;
      delete this.paid;
      
    }
  
    async comparePassword(password: string): Promise<boolean> {
      const isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
    }

  }
  

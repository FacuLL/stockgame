import * as bcrypt from 'bcrypt';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "src/entities/user/entities/user.entity";
import { Game } from "src/entities/game/entities/game.entity";
import { Plan } from "src/entities/plan/entities/plan.entity";
import { CreateInstitutionDto } from "../dto/create-institution.dto";
import { UpdateInstitutionDto } from "../dto/update-institution.dto";
import { BasicUser } from 'src/entities/basicuser/entities/basicuser.entity';
import { fields } from 'src/constants/fields.constants';
import { InstitutionToGame } from 'src/relations/entities/institution-game.entity';
  
  @Index("institutionid_UNIQUE", ["institutionid"], { unique: true })
  @Entity("institution", { schema: "marketgame" })
  export class Institution {
    @PrimaryGeneratedColumn()
    institutionid: number;

    @Column({ length: fields.email.max, nullable: true })
    email?: string;

    @Column({ length: 72, select: false })
    private password: string;
  
    @Column({ default: false, select: false })
    paid: boolean;

    @ManyToOne(() => Plan, (plan) => plan.institutions)
    @JoinTable()
    plan: Plan;

    @OneToMany(() => InstitutionToGame, (institutiongame) => institutiongame.institution)
    games: Game[];

    @OneToOne(() => User, (user) => user.institution, {
      cascade: true
    })
    @JoinColumn()
    user: User;

    @OneToMany(() => Game, (game) => game.owner)
    ownergames: Game[];
  
    @OneToMany(() => BasicUser, (basicuser) => basicuser.institution)
    users: BasicUser[];

    constructor(data: CreateInstitutionDto, user: User) {
      for (let property in data) {
        this[property] = data[property];
      }
      this.user = user;
    }

    updateData(data: UpdateInstitutionDto): void {
      for (let property in data) {
        this[property] = data[property];
      }
    }
  
    async comparePassword(password: string): Promise<boolean> {
      const isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
    }

  }
  

import * as bcrypt from 'bcrypt';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreateBasicuserDto } from "../dto/create-basicuser.dto";
import { UpdateBasicuserDto } from "../dto/update-basicuser.dto";
import { Institution } from 'src/institution/entities/institution.entity';
import { fields } from 'src/constants/fields.constants';

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Index("bUser_user", ["userid"], {})
@Entity("basicuser", { schema: "marketgame" })
export class BasicUser {
  @PrimaryGeneratedColumn()
  basicuserid: number;

  @Column({ length: fields.email.max, nullable: true })
  email?: string;

  @Column({ length: fields.password.max, select: false })
  private password: string;

  @Column({ primary: true, length: fields.username.max, unique: true })
  username: string;

  @OneToOne(() => User, (user) => user.basicuser, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Institution, (institution) => institution.users, {
    onDelete: "CASCADE"
  })
  @JoinTable()
  institution: Institution;

  constructor(data: CreateBasicuserDto, user: User) {
    if (user.type != "basicuser") throw new Error("User must be of type 'basicuser'");
    for (let property in data) {
      this[property] = data[property];
    }
    this.user = user;
  }

  updateData(data: UpdateBasicuserDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  }

  // @OneToMany(() => Teaminvitations, (teaminvitations) => teaminvitations.user)
  // teaminvitations: Teaminvitations[];

  // @OneToMany(
  //   () => Teamparticipants,
  //   (teamparticipants) => teamparticipants.user
  // )
  // teamparticipants: Teamparticipants[];
}

import * as bcrypt from 'bcrypt';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreateBasicuserDto } from "../dto/create-basicuser.dto";
import { UpdateBasicuserDto } from "../dto/update-basicuser.dto";

@Index("userid_UNIQUE", ["userid"], { unique: true })
@Index("bUser_user", ["userid"], {})
@Entity("basicuser", { schema: "marketgame" })
export class BasicUser {
  @PrimaryGeneratedColumn()
  basicuserid: number;

  @Column({ length: 45, nullable: true })
  email?: string;

  @Column({ length: 60 })
  private password: string;

  @Column({ primary: true, length: 45 })
  username: string;

  @OneToOne(() => User, (user) => user.basicuser, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  user: User;

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

  removeSensibleData(): void {
    delete this.password;
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

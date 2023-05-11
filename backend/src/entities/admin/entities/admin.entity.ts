import * as bcrypt from 'bcrypt';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/entities/user/entities/user.entity";
import { fields } from 'src/constants/fields.constants';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { USER_TYPE } from 'src/types/users.type';

@Index("adminid_UNIQUE", ["adminid"], { unique: true })
@Entity("admin", { schema: "marketgame" })
export class Admin {
  @PrimaryGeneratedColumn()
  adminid: number;

  @Column({ length: fields.email.max, nullable: true })
  email: string;

  @Column({ length: 72, select: false })
  private password: string;

  @Column({ primary: true, length: fields.username.max, unique: true })
  username: string;

  @OneToOne(() => User, (user) => user.admin, {
    cascade: true
  })
  @JoinColumn()
  user: User;

  constructor(data: CreateAdminDto, user: User) {
    if (data) {
      if (user?.type != USER_TYPE.ADMIN) throw new Error(`User must be of type '${USER_TYPE.ADMIN}'`);
      for (let property in data) {
        this[property] = data[property];
      }
      this.user = user;
    }
  }

  updateData(data: UpdateAdminDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}
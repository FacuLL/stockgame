import { Request } from "express";
import { User } from "src/entities/user/entities/user.entity";

export interface AdminRequest extends Request {
  user?: User
}
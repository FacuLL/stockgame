import { Request } from "express";
import { BasicUser } from "src/basicuser/entities/basicuser.entity";

export interface BasicUserRequest extends Request {
  user?: BasicUser
}
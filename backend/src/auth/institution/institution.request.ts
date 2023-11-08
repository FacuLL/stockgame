import { Request } from "express";
import { User } from "src/entities/user/entities/user.entity";

export interface InstitutionRequest extends Request {
  user?: User
}
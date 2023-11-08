import { Request } from "express";
import { User } from "src/entities/user/entities/user.entity";

export interface BasicUserRequest extends Request {
    user?: User
}
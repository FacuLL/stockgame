import { Request } from "express";
import { BasicUser } from "src/entities/basicuser/entities/basicuser.entity";

export interface BasicUserRequest extends Request {
    user?: BasicUser
}
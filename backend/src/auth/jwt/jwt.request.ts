import { Request } from "express";
import { UserType } from "../../types/users.type";

export type JWTRequestContent = {
    type: UserType
    userid: number
    entityid: number
}

export interface JWTRequest extends Request {
  user?: JWTRequestContent
}
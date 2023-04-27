import { Request } from "express";
import { JWTRequestContent } from "../jwt/jwt.request";

export type AdminRequestContent = JWTRequestContent & {
    admin: boolean
}

export interface AdminRequest extends Request {
  user?: AdminRequestContent
}
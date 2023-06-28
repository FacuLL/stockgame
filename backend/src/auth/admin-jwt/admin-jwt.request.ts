import { Request } from "express";
import { JWTRequestContent } from "../jwt/jwt.request";

export type AdminJWTRequestContent = JWTRequestContent & {
    admin: boolean
}

export interface AdminJWTRequest extends Request {
  admin?: AdminJWTRequestContent
}
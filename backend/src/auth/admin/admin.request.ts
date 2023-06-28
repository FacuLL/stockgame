import { Request } from "express";
import { Admin } from "src/entities/admin/entities/admin.entity";

export interface AdminRequest extends Request {
  admin?: Admin
}
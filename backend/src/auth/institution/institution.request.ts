import { Request } from "express";
import { Institution } from "src/entities/institution/entities/institution.entity";

export interface InstitutionRequest extends Request {
  user?: Institution
}
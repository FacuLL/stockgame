import { IsOptional } from "class-validator";

export class FindAdminDto {
  @IsOptional()
  adminid?: number;
  @IsOptional()
  email?: string;
  @IsOptional()
  username?: string;
}

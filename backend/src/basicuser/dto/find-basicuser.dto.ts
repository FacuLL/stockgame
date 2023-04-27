import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FindBasicuserDto {
  @IsOptional()
  basicuserid?: number;
  @IsOptional()
  email?: string;
  @IsOptional()
  username?: string;
}

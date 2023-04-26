import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FindBasicuserDto {
  @IsNumber()
  @IsOptional()
  basicuserid?: number;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsNotEmpty()
  @IsOptional()
  username?: string;
}

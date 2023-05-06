import { IsOptional } from "class-validator";
import { UserType } from "src/types/users.type";

export class FindUserDto {
    @IsOptional()
    userid?: number;
    @IsOptional()
    name?: string;
    @IsOptional()
    image?: string;
    @IsOptional()
    publicprofile?: boolean;
    @IsOptional()
    type?: UserType;
}

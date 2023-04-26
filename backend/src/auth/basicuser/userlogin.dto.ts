import { IsNotEmpty } from "class-validator";

export class BasicUserLoginDto {
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    password: string
}

import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateBasicuserDto {
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    password: string
    @IsEmail()
    @IsNotEmpty()
    email: string
}

import { IsNotEmpty } from "class-validator";

export class InstitutionLoginDto {
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    password: string
}
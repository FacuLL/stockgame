import { IsEmail, IsNotEmpty, IsStrongPassword, Length, MaxLength } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class CreateAdminDto {
    @IsNotEmpty()
    @Length(fields.username.min, fields.username.max)
    username: string
    @IsNotEmpty()
    @IsStrongPassword({ minLength: fields.password.min, minSymbols: 0, minUppercase: 1, minLowercase: 1, minNumbers: 1 })
    @MaxLength(fields.password.max)
    password: string
    @IsNotEmpty()
    @IsEmail()
    @Length(fields.email.min, fields.email.max)
    email: string
}

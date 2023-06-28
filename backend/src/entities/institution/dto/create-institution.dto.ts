import { IsEmail, IsNotEmpty, IsStrongPassword, Length, MaxLength } from "class-validator"
import { fields } from "src/constants/fields.constants"

export class CreateInstitutionDto {
    @IsNotEmpty()
    @IsEmail()
    @Length(fields.email.min, fields.email.max)
    email?: string
    @IsNotEmpty()
    @IsStrongPassword({ minLength: fields.password.min, minSymbols: 0, minUppercase: 1, minLowercase: 1, minNumbers: 1 })
    @MaxLength(fields.password.max)
    password: string
}

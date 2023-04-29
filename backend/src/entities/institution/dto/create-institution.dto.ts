import { IsEmail, IsNotEmpty, IsStrongPassword, Length, MaxLength } from "class-validator"
import { fields } from "src/constants/fields.constants"

export class CreateInstitutionDto {
    @IsNotEmpty()
    @Length(fields.name.min, fields.name.max)
    name: string
    @IsNotEmpty()
    @IsEmail()
    @Length(fields.email.min, fields.email.max)
    email?: string
    @IsNotEmpty()
    @IsStrongPassword({ minLength: fields.password.min })
    @MaxLength(fields.password.max)
    password: string
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateInstitutionDto } from './create-institution.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword, Length, MaxLength } from 'class-validator';
import { fields } from 'src/constants/fields.constants';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
    @IsOptional()
    @IsNotEmpty()
    @Length(fields.name.min, fields.name.max)
    name: string
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Length(fields.email.min, fields.email.max)
    email?: string
    @IsOptional()
    @IsNotEmpty()
    oldpassword: string
    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: fields.password.min, minSymbols: 0, minUppercase: 1, minLowercase: 1, minNumbers: 1 })
    @MaxLength(fields.password.max)
    newpassword: string
}

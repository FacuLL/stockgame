 import { PartialType } from '@nestjs/mapped-types';
import { CreateBasicuserDto } from './create-basicuser.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword, Length, MaxLength } from 'class-validator';
import { fields } from 'src/constants/fields.constants';

export class UpdateBasicuserDto extends PartialType(CreateBasicuserDto) {
    @IsOptional()
    @IsNotEmpty()
    @Length(fields.username.min, fields.username.max)
    username?: string
    @IsOptional()
    @IsNotEmpty()
    oldpassword?: string
    @IsOptional()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: fields.password.max, minSymbols: 0, minUppercase: 1, minLowercase: 1, minNumbers: 1 })
    @MaxLength(fields.password.max)
    newpassword?: string
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Length(fields.email.min, fields.email.max)
    email?: string
}

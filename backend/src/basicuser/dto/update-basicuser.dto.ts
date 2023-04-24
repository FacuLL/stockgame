 import { PartialType } from '@nestjs/mapped-types';
import { CreateBasicuserDto } from './create-basicuser.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBasicuserDto extends PartialType(CreateBasicuserDto) {
    @IsNotEmpty()
    @IsOptional()
    username?: string
    @IsNotEmpty()
    @IsOptional()
    password?: string
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string
}

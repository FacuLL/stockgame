import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsPositive, Length } from 'class-validator';
import { fields } from 'src/constants/fields.constants';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
    @IsOptional()
    @IsNotEmpty()
    @Length(fields.title.min, fields.title.max)
    title: string
    @IsOptional()
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: "2" })
    @IsPositive()
    price: number
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    accounts: number
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    courses: boolean
}

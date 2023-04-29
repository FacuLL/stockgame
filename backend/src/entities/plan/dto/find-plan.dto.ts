import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { IsOptional } from 'class-validator';

export class FindPlanDto extends PartialType(CreatePlanDto) {
    @IsOptional()
    title: string
    @IsOptional()
    price: number
    @IsOptional()
    accounts: number
    @IsOptional()
    courses: boolean
}

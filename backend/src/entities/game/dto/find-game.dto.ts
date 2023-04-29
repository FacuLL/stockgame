import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDecimal, IsOptional } from "class-validator";

export class FindGameDto extends PartialType(CreateGameDto) {
    @IsOptional()
    title: string
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    finishDate?: Date
    @IsOptional()
    @IsDecimal({ decimal_digits: "2" })
    initialCash: number
    @IsOptional()
    @IsBoolean()
    finished: boolean
}
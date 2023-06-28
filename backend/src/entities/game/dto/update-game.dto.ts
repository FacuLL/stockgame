import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDecimal, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class UpdateGameDto extends PartialType(CreateGameDto) {
    @IsOptional()
    @IsNotEmpty()
    @Length(fields.title.min, fields.title.max)
    title?: string
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    finishDate?: Date
    @IsOptional()
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: "2" })
    initialCash?: number
    @IsOptional()
    @IsBoolean()
    finished?: boolean
    @IsOptional()
    @IsNotEmpty()
    currencysymbol?: string
}
import { Type } from "class-transformer";
import { IsDate, IsDecimal, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { fields } from "src/constants/fields.constants";


export class CreateGameDto {
    @IsNotEmpty()
    @Length(fields.title.min, fields.title.max)
    title: string
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    finishDate?: Date
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: "2" })
    initialCash: number
    @IsNotEmpty()
    @IsInt()
    currencyid: number
    @IsOptional()
    @IsNotEmpty()
    currencysimbol: string
}

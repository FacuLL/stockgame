import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class CreateHistoricalAssetDto {
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    open: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    close: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    volume: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    high: string;
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    low: string;
}

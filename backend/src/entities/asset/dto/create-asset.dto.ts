import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class CreateAssetDto {
    @IsNotEmpty()
    code: string
    @IsNotEmpty()
    @Length(fields.name.min, fields.name.max)
    name: string
    @IsNotEmpty()
    @IsBoolean()
    automatized: boolean
    @IsNotEmpty()
    image?: string
    @IsNotEmpty()
    @IsInt()
    providerid: number
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    currencyid: number
}

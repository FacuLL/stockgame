import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
    @IsOptional()
    @IsNotEmpty()
    code: string
    @IsOptional()
    @IsNotEmpty()
    @Length(fields.name.min, fields.name.max)
    name: string
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    automatized: boolean
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    providerid: number
}

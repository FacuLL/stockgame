import { IsOptional } from "class-validator";

export class FindAssetDto {
    @IsOptional()
    assetid?: number;
    @IsOptional()
    code?: string;
    @IsOptional()
    name?: string;
    @IsOptional()
    quotation?: number;
    @IsOptional()
    automatized?: boolean;
    @IsOptional()
    image?: string;
    @IsOptional()
    available?: boolean;
    @IsOptional()
    dayhigh?: string;
    @IsOptional()
    daylow?: string;
    @IsOptional()
    lastupdate?: Date;
}

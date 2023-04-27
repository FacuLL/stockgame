import { IsOptional } from "class-validator"

export class FindInstitutionDto {
    @IsOptional()
    institutionid?: number;
    @IsOptional()
    name?: string;
    @IsOptional()
    email?: string;
    @IsOptional()
    paid?: boolean;
}
import { IsNotEmpty, IsOptional, Length } from "class-validator";
import { fields } from "src/constants/fields.constants";

export class CreateProviderDto {
    @IsNotEmpty()
    @Length(fields.name.min, fields.name.max)
    name: string;
    @IsNotEmpty()
    @Length(fields.url.min, fields.url.max)
    url: string;
    @IsNotEmpty()
    assetendpoint: string;
    @IsOptional()
    @IsNotEmpty()
    secretkey?: string;
    @IsNotEmpty()
    pathtoopen: string;
    @IsNotEmpty()
    pathtohigh: string;
    @IsNotEmpty()
    pathtolow: string;
    @IsNotEmpty()
    pathtovolume: string;
    @IsNotEmpty()
    pathtoprice: string;
}

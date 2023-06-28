import { IsBoolean } from "class-validator";

export class CreateCurrencyDto {
    @IsBoolean()
    main: boolean
}

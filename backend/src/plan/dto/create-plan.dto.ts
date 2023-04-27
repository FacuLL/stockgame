import { IsDecimal, IsNotEmpty, IsPositive, Length } from "class-validator"
import { fields } from "src/constants/fields.constants"

export class CreatePlanDto {
    @IsNotEmpty()
    @Length(fields.title.min, fields.title.max)
    title: string
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: "2" })
    @IsPositive()
    price: number
    
    accounts: number
    courses: boolean
}

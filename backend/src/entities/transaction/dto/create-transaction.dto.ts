import { IsInt, IsNotEmpty } from "class-validator";
import { ActionType } from "src/types/actions.type";

export class CreateTransactionDto {
    @IsInt()
    @IsNotEmpty()
    assetid: number
    @IsNotEmpty()
    action: ActionType
    @IsInt()
    @IsNotEmpty()
    amount: number
}

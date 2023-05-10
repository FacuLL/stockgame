import { IsOptional } from "class-validator";
import { ActionType } from "src/types/actions.type";

export class FindTransactionDto {
    @IsOptional()
    assetid: number
    @IsOptional()
    gameid: number
    @IsOptional()
    action: ActionType
    @IsOptional()
    amount: number
}
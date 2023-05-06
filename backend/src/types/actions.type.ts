export type ActionType = "buy" | "sell";

type ActionTypeDict = {
    SELL: ActionType
    BUY: ActionType
}

export const ACTION_TYPE: ActionTypeDict = {
    SELL: "sell",
    BUY: "buy"
}
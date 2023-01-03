import { GameCommodity } from "./Commodity"
import { GameCurrency } from "./Currency"
import { GameShare } from "./Share"

interface PlayingGames {
    gameid: number
    title: string
    startDate: Date
    finishDate?: Date
    finished: number
    initialCash: number
    cash: number
    variation: number
    stocks: number
    transactions: number
    shares?: GameShare[]
    currencies?: GameCurrency[]
    commodities?: GameCommodity[]
}

export { PlayingGames }
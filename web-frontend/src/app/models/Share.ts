import { HistoricalData } from "./Data"

interface GameShare {
    code: string
    name: string
    quotation: number
    automatized: number
    currency: string
    image: string
    available: number
    lastquote: number
    variation: number
    endpoint?: string
    historical?: HistoricalData[]
}

export { GameShare }
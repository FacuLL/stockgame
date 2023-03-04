interface GameCommodity {
    commodityid: number
    name: string
    quotation: number
    image: string
    automatized: number
    available: number
    lastquote: number
    variation: number
    endpoint?: string
}

export { GameCommodity }
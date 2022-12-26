interface PlayingGames {
    gameid: number
    title: string
    startDate: Date
    finishDate?: Date
    finished: number
    initialCash: number
    cash: number
    variation: number
}

export { PlayingGames }
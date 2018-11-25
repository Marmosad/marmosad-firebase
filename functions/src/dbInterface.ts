export interface Deck {
    name: string,
    whiteCardCount: number,
    blackCardCount: number,
    whiteCards: [Card],
    blackCards: [Card]
}

export interface Card {
    id: number,
    body: string
}

export interface Meta {
    count: number
}
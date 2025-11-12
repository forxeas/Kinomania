export interface Countries{
    country: string
}

export interface Genres {
    genre: string
}

export interface Films {
    filmId: number
    nameRu: string
    nameEn: string
    type  : string
    year  : string
    description: string
    countries : Countries[]
    genres : Genres[]
    rating : string
    posterUrl : string
    posterUrlPreview : string
}
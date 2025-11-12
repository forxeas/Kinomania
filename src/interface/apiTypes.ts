import type {Countries, Films, Genres} from "./films";

export interface SearchResponse{
    keyword               : string
    pagesCount            : number
    searchFilmsCountResult: number
    films                 : Films[]
}

export interface MovieSimilar {
    filmId          : number
    nameRu          : string
    nameEn          : string
    nameOriginal    : string
    posterUrl       : string
    posterUrlPreview: string
    relationType    : string

}

export interface SimilarResponse{
    total: number
    items: MovieSimilar[]
}

export interface SearchIdResponse {
    kinopoiskId: number
    imdbId: string
    nameRu: string
    nameEn: string
    nameOriginal: string
    posterUrl: string;
    posterUrlPreview: string
    ratingKinopoisk: number
    ratingImdb?: number
    year: number
    filmLength: number
    slogan: string
    description: string
    shortDescription: string
    webUrl: string
    type: string
    countries: Countries[]
    genres: Genres[]
}

export interface Items {
    kinopoiskId: number
    nameRu: string
    nameEn: string
    nameOriginal: string
    countries: Countries[]
    genres: Genres[]
    ratingKinopoisk: number;
    ratingImdb?: number
    year: string
    posterUrl : string
    posterUrlPreview : string
}

export interface CollectionResponse {
    total: number
    totalPages: number
    items: Items[]
}
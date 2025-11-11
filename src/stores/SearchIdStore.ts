import {ref} from "vue";
import {fetchData} from "../use/FetchData.ts";
import {defineStore} from "pinia";

interface Countries {
    country: string;
}

interface Genres {
    genre: string;
}

interface FilmDetails {
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


export const useSearchIdStore = defineStore('useSearchIdStore', () => {
    const movieIdStore = ref<FilmDetails[]>([])

    const setMovieWithId = async (id: string, apiKey: string) => {
        const film = movieIdStore.value.find(f => f.kinopoiskId === Number(id))
        if(film) {
            return film
        }
        const url: string = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`
        const headers:
            Record<string, string>
            = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

        const res =  await fetchData(url, headers)
        movieIdStore.value.push(res)
        return res
    }
    return {movieIdStore, setMovieWithId}
}, {persist: true})

import {fetchData} from "../use/FetchData.ts";
import {defineStore} from "pinia";
import {ref} from "vue";

interface Countries{
    country: string
}

interface Genres {
    genre: string
}

interface Films {
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

interface SearchResponse{
    keyword               : string
    pagesCount            : number
    searchFilmsCountResult: number
    films                 : Films[]
}

export const useSearchStore = defineStore('useSearchStore', () => {
    const movieKeywordStore = ref<SearchResponse[]>([])

    const setMovie = async (apiKey: string, movieName: string) => {
        const localMovie = movieKeywordStore
          .value
          .find(m => m?.keyword?.toLowerCase() === movieName.toLowerCase())
        if(localMovie) {

            return localMovie
        }
        const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${movieName}`
        const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

        const res = await fetchData(url, headers)
        console.log(res)
        movieKeywordStore.value.push(res)
        return res
    }

    const getMovie = (id: string) => {
        if (!movieKeywordStore.value.length) return null
        for (const chunk of movieKeywordStore.value) {
            const f = chunk?.films?.find(f => f.filmId === Number(id))
            if (f) return f
        }
        return null
    }

    return {movieKeywordStore, setMovie, getMovie}
}, {persist: true})

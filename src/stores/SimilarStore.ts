import {ref} from "vue";
import {fetchData} from "./../use/FetchData.ts";
import {defineStore} from "pinia";

interface MovieSimilar {
    filmId          : number
    nameRu          : string
    nameEn          : string
    nameOriginal    : string
    posterUrl       : string
    posterUrlPreview: string
    relationType    : string

}

interface SimilarResponse{
    total: number
    items: MovieSimilar[]
}

export const useSimilarStore = defineStore('useSimilarStore', () => {
    const movieSimilar = ref<SimilarResponse[]>([])

    const setSimilar = async (apiKey: string, movieId: string) => {
        const localSimilar = movieSimilar
            .value
            .find(m => m.filmId === movieId)

        if(localSimilar) {
            return localSimilar
        }

        const url   = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`
        const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

        return await fetchData<SimilarResponse>(url, movieSimilar.value, headers)
    }

    return {movieSimilar, setSimilar}
}, {persist: true})

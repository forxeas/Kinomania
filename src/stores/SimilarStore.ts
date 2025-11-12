import {ref} from "vue";
import {fetchData} from "./../use/FetchData.ts";
import {defineStore} from "pinia";
import type {SimilarResponse} from "@/interface"

export const useSimilarStore = defineStore('useSimilarStore', () => {
    const similarStore = ref<SimilarResponse[]>([])

    const setSimilar = async (apiKey: string, movieId: string) => {
        const localSimilar = similarStore
            .value
            .find(m => m.filmId === movieId)

        if(localSimilar) {
            return localSimilar
        }

        const url   = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`
        const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

        const res = await fetchData<SimilarResponse>(url, headers)
        similarStore.value.push(res)
        return res
    }

    return {similarStore, setSimilar}
}, {persist: true})

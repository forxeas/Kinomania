import {ref} from "vue";
import {fetchData} from "../use/FetchData.ts";
import {defineStore} from "pinia";
import type {SearchIdResponse} from "@/interface"

export const useSearchIdStore = defineStore('useSearchIdStore', () => {
    const movieIdStore = ref<SearchIdResponse>([])

    const setMovieWithId = async (apiKey: string, id: string) => {
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

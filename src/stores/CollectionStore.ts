import {defineStore} from "pinia";
import {fetchData} from "../use/FetchData.ts";
import {ref} from "vue"
interface Countries {
    country: string;
}

interface Genres {
    genre: string;
}

interface Items {
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

interface FilmDetails {
    total: number
    totalPages: number
    items: Items[]
}

export const useCollectionStore = defineStore('useCollectionStore', () => {
    const CollectionStore = ref<FilmDetails|null>(null)
    const setCollection   = async (apiKey: string) => {
        if(CollectionStore.value) {
            return CollectionStore.value
        }

        const url: string  = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections`
        const headers: Record<string, string> = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

        const res = await fetchData(url, headers)
        CollectionStore.value = res
        console.log(res)
        return res
    }

    return {CollectionStore, setCollection}
}, {persist: true})

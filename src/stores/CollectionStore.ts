import {defineStore} from "pinia";
import {fetchData} from "../use/FetchData.ts";
import {ref} from "vue"
import type {CollectionResponse} from "@/interface"

export const useCollectionStore = defineStore('useCollectionStore', () => {
    const CollectionStore = ref<CollectionResponse|null>(null)
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

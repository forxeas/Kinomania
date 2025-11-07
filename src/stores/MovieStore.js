import {defineStore} from "pinia";

export const useMovieStore =  defineStore('movieStore', {
    state() {
        return {
            movie: [],
            movieSimilar: []
        }
    },
    persist: true,
    getters: {
        getMessage: (state) => {
            return (id) => {
                for (const movieGroup of state.movie) {
                    const found = movieGroup.films.find(f => f.filmId === +id)
                    if (found) return found
                }
                return null
            }
        }
    },
    actions: {
        async setMovie(apiKey, movieName) {
            const localMovie = this.movie.find(m => m.keyword.toLowerCase() === movieName.toLowerCase())

            if(localMovie) {
                return localMovie
            }

            const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${movieName}`
            const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

            return await fetch(url, {headers: headers})
                .then(res => res.json())
                .then(res =>
                {
                    this.movie.push(res)
                    return res
                })
                .catch(err => {
                    console.error(err)
                    return []
                })
        },

        // async setSimilar(apiKey, movieId){
        //     const localSimilar = this.movieSimilar.find(m => m.filmId === movieId)
        //
        //     if(localSimilar) {
        //         return localSimilar
        //     }
        //
        //     const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`
        //     const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}
        //
        //     return await fetch(url, {headers: headers})
        //         .then(res => res.json())
        //         .then(res =>
        //         {
        //             this.movie.push(res)
        //             return res
        //         })
        //         .catch(err => {
        //             console.error(err)
        //             return []
        //         })
        // }
    }
})


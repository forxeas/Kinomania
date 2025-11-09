import {defineStore} from "pinia";

const fetchData = async (url, storage, headers) => {
  return await fetch(url, {headers: headers})
    .then(res => res.json())
    .then(res =>
    {
      storage.push(res)
      return res
    })
    .catch(err => {
      console.error(err)
      return []
    })
};

export const useMovieStore =  defineStore('movieStore', {
    state() {
        return {
            movie: [],
            movieSimilar: [],
            movieCollection: []
        }
    },
    persist: true,
    getters: {
        getMovie: (state) => {
            return (id) => {
                for (const movieGroup of state.movie) {
                    const found = movieGroup?.films.find(f => f.filmId === +id)
                    if (found) return found
                }
                return null
            }
        }
    },
    actions: {
        async setMovie(apiKey, movieName) {
            const localMovie = this.movie.find(m => m?.keyword?.toLowerCase() === movieName.toLowerCase())
            if(localMovie) {
                return localMovie
            }

            const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${movieName}`
            const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

            return await fetchData(url, this.movie, headers)
        },

        async setSimilar(apiKey, movieId){
            const localSimilar = this.movieSimilar.find(m => m.filmId === movieId)

            if(localSimilar) {
                return localSimilar
            }

            const url   = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`
            const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}


            return await fetchData(url, this.movieSimilar, headers)
        },

        async setCollection(apiKey) {
          if(this.movieCollection.length > 0) {
              return this.movieCollection
          }

          const url  = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections`
          const headers= {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

          return await fetchData(url, this.movieCollection, headers)
        }
    }
})


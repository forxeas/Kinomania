import {defineStore} from "pinia";
import {computed, ref} from "vue";

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

export const useMovieStore =  defineStore('useMovieStore', () => {
  const movie = ref([])
  const movieSimilar = ref([])
  const movieCollection = ref([])
  const movieWithId = ref([])

  const setMovie = async (apiKey, movieName) => {
    const localMovie = movie.value.find(m => m?.keyword?.toLowerCase() === movieName.toLowerCase())
    if(localMovie) {
      return localMovie
    }
    const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${movieName}`
    const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

    return await fetchData(url, movie.value, headers)
  }

  const setSimilar = async (apiKey, movieId) => {
    const localSimilar = movieSimilar.value.find(m => m.filmId === movieId)

    if(localSimilar) {
      return localSimilar
    }

    const url   = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`
    const headers = {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

    return await fetchData(url, movieSimilar.value, headers)
  }

  const setCollection = async (apiKey) => {
    if(movieCollection.value.length > 0 && movieCollection.value.length < 2) {
      return movieCollection.value
    } else {
      movieCollection.value = []
    }

    const url  = `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections`
    const headers= {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

    return await fetchData(url, movieCollection.value, headers)
  }

  const getMovie = (id) => {
    if (!movie.value.length) return null
    for (const chunk of movie.value) {
      const f = chunk?.films?.find(f => f.filmId === Number(id))
      if (f) return f
    }
    return null
  }

  const setMovieWithId = async (id, apiKey) => {
    const film = movieWithId.value.find(f => f.kinopoiskId === id)
    if(film) {
      return film
    }
    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`
    const headers= {Accept: 'application/json', 'Content-Type': 'application/json', 'X-API-KEY': apiKey}

    return await fetchData(url, movieWithId.value, headers)
  }
  return {
    movie,
    movieSimilar,
    movieCollection,
    movieWithId,
    setMovie,
    setSimilar,
    setCollection,
    getMovie,
    setMovieWithId
  }
}, {persist: true})

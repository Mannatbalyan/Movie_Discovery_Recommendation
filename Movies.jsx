
import { useState, useEffect } from "react"
import MovieCard from "../components/MovieCard"

const Movies = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const [movies, setMovies] = useState([])
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}${pages ? `&page=${pages}` : ""}`
      )
      const data = await res.json()
      setMovies(data.results)
      setTotalPages(data.total_pages)
    }

    fetchTrendingMovies()
    window.scrollTo(0, 0)
  }, [pages])


  return (
    <div className="home">
      <div className="header-wrapper">
        <h2 className="section-title">Trending Movies</h2>
        <button className="Filter-btn" onClick={() => window.location.href = '/topratedmovies'}>Top Rated</button>
      </div>
      <div className="container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>


      <div className="pagination">
        <button
          onClick={() => setPages(p => p - 1)}
          disabled={pages === 1}
        >
          ← Previous
        </button>
        <span>{pages} of {totalPages}</span>
        <button
          onClick={() => setPages(p => p + 1)}
          disabled={pages === totalPages}
        >
          Next →
        </button>
      </div>


    </div>
  )
}

export default Movies
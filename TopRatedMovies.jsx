import { useState, useEffect } from "react"
import MovieCard from "../components/MovieCard"

const TopRatedMovies = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const [topRated, setTopRated] = useState([])
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTopRated = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}${pages ? `&page=${pages}` : ""}`
      )
      const data = await res.json()


      const moviesWithType = data.results.map(movie => ({
        ...movie,
        media_type: "movie"
      }))

      setTopRated(moviesWithType)
      setTotalPages(data.total_pages)
    }

    fetchTopRated()
    window.scrollTo(0, 0)
  }, [pages])

  return (
    <div className="home">
      <div className="header-wrapper">
        <h2 className="section-title">Top Rated</h2>
        <button className="Filter-btn" onClick={() => window.location.href = '/movies'}>Trending Movies</button>
      </div>
      <div className="container">
        {topRated.map((movie) => (
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

export default TopRatedMovies
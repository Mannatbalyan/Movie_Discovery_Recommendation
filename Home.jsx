import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import MovieCard from "../components/MovieCard"
import "./Home.css"

const Home = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const [movies, setMovies] = useState([])
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q")
  const [isSearching, setIsSearching] = useState(false)
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // load trending or search results on page load / route change
  useEffect(() => {
    if (query) {
      searchMovies(query)
      window.scrollTo(0, 0)
    } else {
      fetchTrending()
      window.scrollTo(0, 0)
    }
  }, [query , pages])

  const fetchTrending = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${pages}`
    )
    const data = await res.json()
    setMovies(data.results.filter(item => item.media_type !== "person"))
    setIsSearching(false)
    setTotalPages(data.total_pages)
    
  } 

  const searchMovies = async (q) => {
    setPages(1)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${q}&page=${pages}`
    )
    const data = await res.json()
    setMovies(data.results.filter(item => item.media_type !== "person"))
    setIsSearching(true)
    setTotalPages(data.total_pages)
  }



  return (
    <div className="home">
      <h2 className="section-title">
        {isSearching ? `Results for "${query}"` : "Trending Today"}
      </h2>

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

export default Home
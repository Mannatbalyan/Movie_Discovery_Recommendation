import { useState, useEffect } from "react"
import MovieCard from "../components/MovieCard"
import {
  getCompareMovies,
  removeMovieFromCompare,
  clearCompareMovies
} from "../utils/compareStorage"

const Movies = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const [movies, setMovies] = useState([])
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [compareMovies, setCompareMovies] = useState([])
  const [movieDetails, setMovieDetails] = useState([])

  // Fetch Trending Movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=${pages}`
      )

      const data = await res.json()
      setMovies(data.results || [])
      setTotalPages(data.total_pages || 1)
    }

    fetchTrendingMovies()
    window.scrollTo(0, 0)
  }, [pages])

  // Update Comparison List
  useEffect(() => {
    const updateCompareMovies = () => {
      setCompareMovies(getCompareMovies())
    }

    updateCompareMovies()

    window.addEventListener("compareUpdated", updateCompareMovies)

    return () => {
      window.removeEventListener("compareUpdated", updateCompareMovies)
    }
  }, [])

  // Fetch Movie Details
  useEffect(() => {
    const fetchDetails = async () => {
      if (compareMovies.length === 0) {
        setMovieDetails([])
        return
      }

      try {
        const details = await Promise.all(
          compareMovies.map(async (movie) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
            )
            return await res.json()
          })
        )

        setMovieDetails(details)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDetails()
  }, [compareMovies])

  return (
    <div className="home">

      <div className="header-wrapper">
        <h2 className="section-title">Trending Movies</h2>

        <button
          className="Filter-btn"
          onClick={() => window.location.href = "/topratedmovies"}
        >
          Top Rated
        </button>
      </div>

      <div className="container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
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

      {/* Movie Comparison */}
      <div
        id="comparison"
        style={{ padding: "40px 5%" }}
      >
        <h2 className="section-title">Compare Movies</h2>

        {compareMovies.length === 0 ? (
          <p>Select movies using the Add to Compare button.</p>
        ) : (
          <>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              marginTop: "25px"
            }}>
              {movieDetails.map((movie) => (
                <div
                  key={movie.id}
                  style={{
                    background: "#1c1c2b",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "250px",
                    color: "white"
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/250x350"
                    }
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: "10px" }}
                  />

                  <h3>{movie.title}</h3>

                  <p>Rating: ⭐ {movie.vote_average?.toFixed(1)}</p>

                  <p>
                    Release Year: {movie.release_date?.split("-")[0] || "N/A"}
                  </p>

                  <p>
                    Genre: {movie.genres?.map(g => g.name).join(", ") || "N/A"}
                  </p>

                  <p>Runtime: {movie.runtime || "N/A"} minutes</p>

                  <p>
                    Language: {movie.original_language?.toUpperCase() || "N/A"}
                  </p>

                  <button onClick={() => removeMovieFromCompare(movie.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {compareMovies.length < 2 && (
              <p>Select one more movie to compare.</p>
            )}

            <button
              onClick={() => clearCompareMovies()}
              style={{ marginTop: "20px" }}
            >
              Clear Comparison
            </button>
          </>
        )}
      </div>

    </div>
  )
}

export default Movies

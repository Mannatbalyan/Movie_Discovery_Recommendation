import { useState, useEffect } from "react"
import MovieCard from "../components/MovieCard"

const TopRatedTVShows = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const [topRated, setTopRated] = useState([])
  const [pages, setPages] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTopRated = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}${pages ? `&page=${pages}` : ""}`
      )
      const data = await res.json()

       const showsWithType = data.results.map(show => ({
        ...show, 
        media_type: "tv"}));


      setTopRated(showsWithType)
      setTotalPages(data.total_pages)
    }

    fetchTopRated()
    window.scrollTo(0, 0) 
  }, [pages])

  return (
    <div className="home">
      <div className="header-wrapper">
        <h2 className="section-title">Top Rated TV Shows</h2>
        <button className="Filter-btn" onClick={() => window.location.href = '/tvshows'}>Trending TV shows
        </button>
      </div>
      <div className="container">
        {topRated.map((tvshow) => (
          <MovieCard key={tvshow.id} movie={tvshow} />
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

export default TopRatedTVShows;
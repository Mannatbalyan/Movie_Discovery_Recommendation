import { useNavigate } from "react-router-dom"

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    const type = movie.media_type === "tv" ? "tv" : "movie"
    navigate(`/${type}/${movie.id}`)
  }

  return (
    <div className="movie" onClick={handleClick}>
      <div className="movie-poster">
        <img 
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Poster"
          }
          alt={movie.original_title}
        />

        <span className="media-type">
            {movie.media_type === "tv" ? "TV Show" : "Movie"}
        </span>

        <div className="movie-overlay">
          <p className="movie-overview">
            {movie.overview 
              ? movie.overview.slice(0, 140) + "..." 
              : "No description available"}
          </p>
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title || movie.name}</h3>
        <div className="movie-meta">
          <span className="year">
            {(movie.release_date || movie.first_air_date)?.split("-")[0] || "TBA"}
          </span>
          {movie.vote_average > 0 && (
            <span className="rating">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
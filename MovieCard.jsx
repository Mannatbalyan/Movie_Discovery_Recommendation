import { useNavigate } from "react-router-dom"

import { useState, useEffect } from "react";
import {
  addMovieToCompare,
  getCompareMovies
} from "../utils/compareStorage";


const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const [added, setAdded] = useState(false);

useEffect(() => {
  const updateStatus = () => {
    const movies = getCompareMovies();
    setAdded(movies.some((m) => m.id === movie.id));
  };

  updateStatus();

  window.addEventListener("compareUpdated", updateStatus);

  return () => {
    window.removeEventListener("compareUpdated", updateStatus);
  };
}, [movie.id]);

  const handleClick = () => {
    const type = movie.media_type === "tv" ? "tv" : "movie"
    navigate(`/${type}/${movie.id}`)
  }

  const handleCompare = (e) => {
  e.stopPropagation();

  if (movie.media_type === "tv") return;

  const result = addMovieToCompare({
    ...movie,
    media_type: "movie"
  });

  if (result === "added") {
    setAdded(true);
    alert("Movie added to comparison!");
  } else if (result === "already") {
    alert("Movie already added!");
  } else {
    alert("You can compare only 2 movies!");
  }
};

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

      <button
        className="compare-btn"
        onClick={handleCompare}
        onMouseDown={(e) => e.stopPropagation()}
        disabled={added || movie.media_type === "tv"}
      >
        {movie.media_type === "tv"
          ? "Movies Only"
          : added
          ? "✓ Added"
          : "Add to Compare"}
      </button>
    </div>
  </div>
);
};

export default MovieCard;

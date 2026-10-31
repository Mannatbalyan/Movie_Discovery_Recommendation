import { useState, useEffect } from "react";

import {
  getCompareMovies,
  removeMovieFromCompare,
  clearCompareMovies
} from "../utils/compareStorage";

import "./CompareMovies.css";

const CompareMovies = () => {

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMovies = async () => {

    const selectedMovies = getCompareMovies();

    if (selectedMovies.length === 0) {
      setMovies([]);
      return;
    }

    setLoading(true);

    try {

      const details = await Promise.all(
        selectedMovies.map(async (movie) => {

          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
          );

          if (!response.ok) {
            throw new Error("Unable to fetch movie details");
          }

          return await response.json();

        })
      );

      setMovies(details);

    } catch (error) {

      console.error(error);
      alert("Unable to load movie details.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadMovies();

    window.addEventListener("compareUpdated", loadMovies);

    return () => {
      window.removeEventListener("compareUpdated", loadMovies);
    };

  }, []);

  const removeMovie = (id) => {
    removeMovieFromCompare(id);
  };

  const getHigherRating = () => {

    if (movies.length !== 2) return -1;

    if (movies[0].vote_average > movies[1].vote_average) {
      return movies[0].id;
    }

    if (movies[1].vote_average > movies[0].vote_average) {
      return movies[1].id;
    }

    return -1;
  };

  const winner = getHigherRating();

  if (loading) {
    return <h2 className="compare-message">Loading movies...</h2>;
  }

  if (movies.length === 0) {
    return (
      <div className="compare-empty">
        <h2>No Movies Selected</h2>
        <p>Go to Movies and select two movies to compare.</p>
      </div>
    );
  }

  return (

    <div className="compare-page">

      <h1>Movie Comparison</h1>

      <p className="compare-subtitle">
        Compare your favourite movies side by side.
      </p>

      <div className="compare-container">

        {movies.map((movie) => (

          <div
            className={`compare-card ${
              winner === movie.id ? "winner" : ""
            }`}
            key={movie.id}
          >

            {winner === movie.id && (
              <span className="winner-badge">
                ⭐ Higher Rated
              </span>
            )}

            <img
              className="compare-poster"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.title}
            />

            <h2>{movie.title}</h2>

            <div className="compare-details">

              <p>
                <strong>Genre:</strong>{" "}
                {movie.genres?.map(g => g.name).join(", ") || "N/A"}
              </p>

              <p>
                <strong>Release Year:</strong>{" "}
                {movie.release_date?.split("-")[0] || "N/A"}
              </p>

              <p>
                <strong>Rating:</strong>{" "}
                ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
              </p>

              <p>
                <strong>Language:</strong>{" "}
                {movie.original_language?.toUpperCase() || "N/A"}
              </p>

              <p>
                <strong>Popularity:</strong>{" "}
                {movie.popularity?.toFixed(1) || "N/A"}
              </p>

              <p>
                <strong>Runtime:</strong>{" "}
                {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </p>

            </div>

            <button
              className="remove-btn"
              onClick={() => removeMovie(movie.id)}
            >
              Remove Movie
            </button>

          </div>

        ))}

      </div>

      {movies.length === 1 && (
        <p className="compare-message">
          Select one more movie to complete comparison.
        </p>
      )}

      <button
        className="clear-btn"
        onClick={clearCompareMovies}
      >
        Clear Comparison
      </button>

    </div>

  );

};

export default CompareMovies;

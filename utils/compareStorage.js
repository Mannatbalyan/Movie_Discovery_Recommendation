const STORAGE_KEY = "compareMovies";

export const getCompareMovies = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const addMovieToCompare = (movie) => {
  const movies = getCompareMovies();

  if (movies.some((m) => m.id === movie.id)) {
    return "already";
  }

  if (movies.length >= 2) {
    return "full";
  }

  movies.push(movie);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

  window.dispatchEvent(new Event("compareUpdated"));

  return "added";
};

export const removeMovieFromCompare = (id) => {
  const movies = getCompareMovies().filter((m) => m.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));

  window.dispatchEvent(new Event("compareUpdated"));
};

export const clearCompareMovies = () => {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(new Event("compareUpdated"));
};

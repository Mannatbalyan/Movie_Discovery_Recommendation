import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import TVShows from "./pages/TVShows"
import TopRatedMovies from "./pages/TopRatedMovies"
import TopRatedTVShows from "./pages/TopRatedTVshows.jsx"
import MovieDetail from "./pages/MovieDetail"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/topratedmovies" element={<TopRatedMovies />} />
        <Route path="/topratedtvshows" element={<TopRatedTVShows />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<MovieDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
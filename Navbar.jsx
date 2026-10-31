import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Navbar.css"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    if (searchTerm.trim() === "") return
    navigate(`/?q=${searchTerm}`)
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🎬
          <span className="Logo-Half">Movie</span>
          <span className="Logo-Half-2">Finder</span>
        </Link>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search movies and TV shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
          }}
        />
        <button onClick={handleSearch}>
          Search 🔍
        </button>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li className={location.pathname === "/movies" ? "active" : ""}>
          <Link to="/movies" onClick={() => setMenuOpen(false)}>Movies</Link>
        </li>
        <li className={location.pathname === "/tvshows" ? "active" : ""}>
          <Link to="/tvshows" onClick={() => setMenuOpen(false)}>TV Shows</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import YouTube from "react-youtube"
import "./MovieDetail.css"

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const [detail, setDetail] = useState(null)
  const [cast, setCast] = useState([])
  const [trailer, setTrailer] = useState(null)
  const isTV = window.location.pathname.includes("/tv/")

  useEffect(() => {
    const type = isTV ? "tv" : "movie"

    // fetch main details
    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setDetail(data))

    // fetch cast
    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setCast(data.cast?.slice(0, 16)))

    // fetch trailer
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const trailer = data.results?.find(
          v => v.type === "Trailer" && v.site === "YouTube"
        )
        setTrailer(trailer)
      })
  }, [id])

  if (!detail) return <div className="loading">Loading...</div>

  return (
    <div className="detail">

      {/* backdrop */}
      <div className="backdrop" style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`
      }}>
        <div className="backdrop-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="backdrop-info">
            <h1>{detail.title || detail.name}</h1>
            <div className="backdrop-meta">
              <span>{(detail.release_date || detail.first_air_date)?.split("-")[0]}</span>
              {detail.vote_average > 0 && (
                <span>⭐ {detail.vote_average.toFixed(1)}</span>
              )}
              {detail.runtime && <span>{detail.runtime} min</span>}
              {detail.number_of_seasons && (
                <span>{detail.number_of_seasons} Seasons</span>
              )}
              <span>{detail.status}</span>
            </div>
            <div className="genres">
              {detail.genres?.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">

        {/* overview */}
        <section className="overview">
          <h2>Overview</h2>
          <p>{detail.overview || "No overview available."}</p>
        </section>

        {/* trailer */}
        {trailer && (
          <section className="trailer">
            <h2>Trailer</h2>
            <YouTube
              videoId={trailer.key}
              opts={{
                width: "100%",
                height: "450",
                playerVars: { autoplay: 0 }
              }}
            />
          </section>
        )}

        {/* cast */}
        {cast.length > 0 && (
          <section className="cast">
            <h2>Cast</h2>
            <div className="cast-grid">
              {cast.map(person => (
                <div key={person.id} className="cast-card">
                  <img
                    src={person.profile_path
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : "https://via.placeholder.com/100x150?text=No+Photo"
                    }
                    alt={person.name}
                  />
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-character">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default MovieDetail
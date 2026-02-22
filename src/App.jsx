import { useState, useEffect } from "react"
import { supabase } from "./supabase"

const kategoriList = ["Semua", "Film", "Donghua", "Drakor", "Drachin"]
const tabList = ["Rekomendasi", "Populer", "Terbaru"]

function formatViews(num) {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'Jt'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'Rb'
  return num.toString()
}

function BadgeKategori({ kategori }) {
  const warna = {
    Film: "bg-blue-500",
    Donghua: "bg-purple-500",
    Drakor: "bg-pink-500",
    Drachin: "bg-orange-500",
  }
  return (
    <span className={`${warna[kategori] || "bg-red-500"} text-white text-xs px-2 py-1 rounded font-bold uppercase`}>
      {kategori}
    </span>
  )
}

function FilmCard({ film, onClick }) {
  return (
    <div onClick={onClick} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition">
      <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          {film.thumbnail ? (
            <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🎬</span>
          )}
          <span className="absolute top-2 right-2">
            <BadgeKategori kategori={film.category} />
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="font-semibold truncate text-sm">{film.title}</p>
        <p className="text-gray-400 text-xs mt-1">👁 {formatViews(film.views)} • {film.year}</p>
      </div>
    </div>
  )
}

function DetailFilm({ film, onBack }) {
  const [episodes, setEpisodes] = useState([])
  const [episodeAktif, setEpisodeAktif] = useState(null)
  const [rekomendasi, setRekomendasi] = useState([])
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    // Ambil episodes
    async function fetchEpisodes() {
      const { data } = await supabase
        .from('episodes')
        .select('*')
        .eq('movie_id', film.id)
        .order('episode_number', { ascending: true })
      if (data && data.length > 0) {
        setEpisodes(data)
        setEpisodeAktif(data[0])
      } else if (film.video_url) {
        setEpisodeAktif({ video_url: film.video_url, title: 'Full Movie' })
      }
    }

    // Ambil rekomendasi
    async function fetchRekomendasi() {
      const { data } = await supabase
        .from('movie_details')
        .select('*')
        .eq('category', film.category)
        .neq('id', film.id)
        .limit(4)
      if (data) setRekomendasi(data)
    }

    // Tambah views
    async function tambahViews() {
      await supabase
        .from('movie_details')
        .update({ views: (film.views || 0) + 1 })
        .eq('id', film.id)
    }

    fetchEpisodes()
    fetchRekomendasi()
    tambahViews()
  }, [film.id])

  const videoUrl = episodeAktif?.video_url || film.video_url

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 flex items-center sticky top-0 z-10 border-b border-gray-800">
        <h1 className="text-red-500 text-lg font-bold">🎬 Jelajahi Film</h1>
      </header>

      {/* Video Player */}
      <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
        {videoUrl ? (
          <video src={videoUrl} controls className="w-full h-full" preload="metadata" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🎬</span>
            <p className="text-gray-500 text-sm">Video belum tersedia</p>
          </div>
        )}
      </div>

      {/* Info Film */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold flex-1">{film.title}</h2>
          <button
            onClick={() => setShowShare(true)}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-red-500 transition"
          >
            🔗 Bagikan
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-gray-900 p-3 rounded-lg border border-gray-800 mb-3">
          <BadgeKategori kategori={film.category} />
          <span className="text-gray-400 text-sm">👁 {formatViews(film.views)} Views</span>
          <span className="text-gray-400 text-sm">📅 {film.year}</span>
        </div>

        {/* Daftar Episode */}
        {episodes.length > 1 && (
          <div className="mb-4">
            <h3 className="font-bold text-base border-l-4 border-red-500 pl-3 mb-3">Daftar Episode</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {episodes.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => setEpisodeAktif(ep)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                    episodeAktif?.id === ep.id
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400"
                  }`}
                >
                  Eps {ep.episode_number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sinopsis */}
        <div className="border-t border-gray-800 pt-4 mb-4">
          <h3 className="font-bold text-base mb-2">Sinopsis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {film.description || "Deskripsi tidak tersedia."}
          </p>
        </div>

        <button onClick={onBack} className="text-gray-500 text-sm hover:text-white transition">
          ← Kembali ke Beranda
        </button>
      </div>

      {/* Rekomendasi */}
      {rekomendasi.length > 0 && (
        <div className="px-4 pb-8">
          <h3 className="font-bold text-base border-l-4 border-red-500 pl-3 mb-4">Rekomendasi Serupa</h3>
          <div className="grid grid-cols-2 gap-3">
            {rekomendasi.map(f => (
              <FilmCard key={f.id} film={f} onClick={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Modal Share */}
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4" onClick={() => setShowShare(false)}>
          <div className="bg-gray-900 rounded-xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Bagikan Film</h3>
              <button onClick={() => setShowShare(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="flex gap-2">
              <input readOnly value={window.location.href} className="flex-1 bg-gray-800 text-sm px-3 py-2 rounded-lg outline-none text-gray-300" />
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => setShowShare(false))}
                className="bg-red-500 px-4 py-2 rounded-lg text-sm font-bold"
              >
                Salin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [aktifKategori, setAktifKategori] = useState("Semua")
  const [aktifTab, setAktifTab] = useState("Rekomendasi")
  const [search, setSearch] = useState("")
  const [filmDipilih, setFilmDipilih] = useState(null)

  useEffect(() => {
    async function fetchFilms() {
      const { data } = await supabase
        .from('movie_details')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setFilms(data)
      setLoading(false)
    }
    fetchFilms()
  }, [])

  const filtered = films.filter(f => {
    const cocokKategori = aktifKategori === "Semua" || f.category === aktifKategori
    const cocokSearch = f.title?.toLowerCase().includes(search.toLowerCase())
    return cocokKategori && cocokSearch
  })

  if (filmDipilih) {
    return <DetailFilm film={filmDipilih} onBack={() => setFilmDipilih(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b border-gray-800">
        <h1 className="text-red-500 text-lg font-bold whitespace-nowrap">🎬 Jelajahi Film</h1>
        <input
          className="bg-gray-800 rounded-full px-4 py-2 text-sm w-full outline-none"
          placeholder="Cari film..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </nav>

      {/* Tab */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-2">
        {tabList.map(t => (
          <button key={t} onClick={() => setAktifTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${aktifTab === t ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Kategori */}
      <div className="flex gap-2 px-4 mt-2 overflow-x-auto pb-2">
        {kategoriList.map(k => (
          <button key={k} onClick={() => setAktifKategori(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${aktifKategori === k ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}>
            {k}
          </button>
        ))}
      </div>

      {/* Film Grid */}
      <div className="px-4 mt-4 pb-8">
        {loading ? (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500">Memuat film...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(film => (
                <FilmCard key={film.id} film={film} onClick={() => setFilmDipilih(film)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 mt-8">
                {films.length === 0 ? "Belum ada film tersedia" : "Film tidak ditemukan"}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
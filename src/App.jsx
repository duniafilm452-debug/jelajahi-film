import { useState } from "react"

const films = [
  { id: 1, title: "Avengers", genre: "Action", year: "2024", kategori: "Film", tab: "Populer", views: 1200, sinopsis: "Sebuah tim superhero bersatu untuk menyelamatkan dunia dari ancaman terbesar.", video_url: "" },
  { id: 2, title: "Interstellar", genre: "Sci-Fi", year: "2023", kategori: "Film", tab: "Terbaru", views: 980, sinopsis: "Seorang astronot melakukan perjalanan melewati lubang cacing untuk menyelamatkan umat manusia.", video_url: "" },
  { id: 3, title: "The Batman", genre: "Action", year: "2024", kategori: "Film", tab: "Populer", views: 3400, sinopsis: "Batman menyelidiki serangkaian kejahatan misterius di Gotham City.", video_url: "" },
  { id: 4, title: "Inception", genre: "Thriller", year: "2023", kategori: "Film", tab: "Rekomendasi", views: 2100, sinopsis: "Seorang pencuri yang masuk ke dalam mimpi orang lain untuk mencuri rahasia.", video_url: "" },
  { id: 5, title: "Tale of Demon", genre: "Fantasy", year: "2024", kategori: "Donghua", tab: "Rekomendasi", views: 5600, sinopsis: "Seorang pemuda berjuang melawan iblis untuk melindungi desanya.", video_url: "" },
  { id: 6, title: "Crash Landing", genre: "Romance", year: "2023", kategori: "Drakor", tab: "Terbaru", views: 8900, sinopsis: "Seorang wanita kaya mendarat secara tidak sengaja di Korea Utara dan jatuh cinta.", video_url: "" },
  { id: 7, title: "The Bad Kids", genre: "Thriller", year: "2023", kategori: "Drachin", tab: "Populer", views: 4300, sinopsis: "Tiga anak menyaksikan sebuah pembunuhan dan terjebak dalam rahasia berbahaya.", video_url: "" },
]

const kategoriList = ["Semua", "Film", "Donghua", "Drakor", "Drachin"]
const tabList = ["Rekomendasi", "Populer", "Terbaru"]

function formatViews(num) {
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

function ShareModal({ film, onClose }) {
  const [copied, setCopied] = useState(false)
  const link = `https://jelajahi-film.pages.dev/film/${film.id}`

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false); onClose() }, 1500)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Bagikan Film</h3>
          <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
        </div>
        <div className="flex gap-4 justify-center mb-4">
          <a href={`https://wa.me/?text=${film.title} - ${link}`} target="_blank" rel="noreferrer"
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center text-xl transition">
            💬
          </a>
          <a href={`https://t.me/share/url?url=${link}&text=${film.title}`} target="_blank" rel="noreferrer"
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-blue-500 flex items-center justify-center text-xl transition">
            ✈️
          </a>
        </div>
        <div className="flex gap-2">
          <input readOnly value={link} className="flex-1 bg-gray-800 text-sm px-3 py-2 rounded-lg outline-none text-gray-300" />
          <button onClick={copy} className="bg-red-500 px-4 py-2 rounded-lg text-sm font-bold">
            {copied ? "✓" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailFilm({ film, onBack }) {
  const [showShare, setShowShare] = useState(false)
  const rekomendasi = films.filter(f => f.id !== film.id && f.kategori === film.kategori).slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-gray-800">
        <h1 className="text-red-500 text-lg font-bold">🎬 Jelajahi Film</h1>
      </header>

      {/* Video Player */}
      <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
        {film.video_url ? (
          <video
            src={film.video_url}
            controls
            className="w-full h-full"
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🎬</span>
            <p className="text-gray-500 text-sm">Video belum tersedia</p>
          </div>
        )}
      </div>

      {/* Info Film */}
      <div className="p-4">
        {/* Judul & Tombol Share */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold flex-1">{film.title}</h2>
          <button
            onClick={() => setShowShare(true)}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-red-500 transition"
          >
            🔗 <span>Bagikan</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 items-center bg-gray-900 p-3 rounded-lg border border-gray-800 mb-3">
          <BadgeKategori kategori={film.kategori} />
          <span className="text-gray-400 text-sm">👁 {formatViews(film.views)} Views</span>
          <span className="text-gray-400 text-sm">📅 {film.year}</span>
          <span className="text-gray-400 text-sm">🎭 {film.genre}</span>
        </div>

        {/* Tombol Tonton */}
        <button className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold text-lg mb-4 transition">
          ▶ Tonton Sekarang
        </button>

        {/* Sinopsis */}
        <div className="border-t border-gray-800 pt-4">
          <h3 className="font-bold text-base mb-2">Sinopsis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{film.sinopsis}</p>
        </div>

        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="mt-4 text-gray-500 text-sm hover:text-white transition"
        >
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

      {showShare && <ShareModal film={film} onClose={() => setShowShare(false)} />}
    </div>
  )
}

function FilmCard({ film, onClick }) {
  return (
    <div onClick={onClick} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition">
      <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <span className="text-4xl">🎬</span>
          <span className="absolute top-2 right-2">
            <BadgeKategori kategori={film.kategori} />
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

function App() {
  const [aktifKategori, setAktifKategori] = useState("Semua")
  const [aktifTab, setAktifTab] = useState("Rekomendasi")
  const [search, setSearch] = useState("")
  const [filmDipilih, setFilmDipilih] = useState(null)

  const filtered = films.filter(f => {
    const cocokKategori = aktifKategori === "Semua" || f.kategori === aktifKategori
    const cocokTab = f.tab === aktifTab
    const cocokSearch = f.title.toLowerCase().includes(search.toLowerCase())
    return cocokKategori && cocokTab && cocokSearch
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
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(film => (
            <FilmCard key={film.id} film={film} onClick={() => setFilmDipilih(film)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Film tidak ditemukan</p>
        )}
      </div>
    </div>
  )
}

export default App
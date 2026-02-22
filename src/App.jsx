const films = [
  { id: 1, title: "Avengers", genre: "Action", year: "2024" },
  { id: 2, title: "Interstellar", genre: "Sci-Fi", year: "2023" },
  { id: 3, title: "The Batman", genre: "Action", year: "2024" },
  { id: 4, title: "Inception", genre: "Thriller", year: "2023" },
]

function FilmCard({ film }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition">
      <div className="bg-gray-700 h-40 flex items-center justify-center">
        <span className="text-4xl">🎬</span>
      </div>
      <div className="p-3">
        <p className="font-semibold truncate">{film.title}</p>
        <p className="text-gray-400 text-sm">{film.year} • {film.genre}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-red-500 text-xl font-bold">🎬 Jelajahi Film</h1>
        <button className="bg-red-500 px-4 py-2 rounded-lg font-semibold text-sm">
          Login
        </button>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-red-900 to-gray-900 mx-4 mt-6 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Selamat Datang!</h2>
        <p className="text-gray-300">Temukan dan tonton film favoritmu</p>
        <button className="mt-4 bg-red-500 px-6 py-2 rounded-lg font-semibold">
          Mulai Nonton
        </button>
      </div>

      {/* Film List */}
      <div className="px-4 mt-8 pb-8">
        <h3 className="text-xl font-bold mb-4">Film Populer</h3>
        <div className="grid grid-cols-2 gap-4">
          {films.map(film => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
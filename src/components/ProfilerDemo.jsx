import { useState, useMemo } from 'react'

const initialMovies = [
  { id: 1, title: 'Inception', year: 2010, rating: 8.8, tickets: 320 },
  { id: 2, title: 'Dune', year: 2021, rating: 8.0, tickets: 210 },
  { id: 3, title: 'The Dark Knight', year: 2008, rating: 9.0, tickets: 540 },
  { id: 4, title: 'Interstellar', year: 2014, rating: 8.6, tickets: 390 },
  { id: 5, title: 'Oppenheimer', year: 2023, rating: 8.9, tickets: 480 },
  { id: 6, title: 'Avatar', year: 2009, rating: 7.8, tickets: 150 },
  { id: 7, title: 'Tenet', year: 2020, rating: 7.4, tickets: 190 },
  { id: 8, title: 'Mad Max: Fury Road', year: 2015, rating: 8.1, tickets: 260 },
]

// 🐛 This function simulates a slow operation — do not remove
function sleep(ms) {
  const start = Date.now()
  while (Date.now() - start < ms) {}
}

export default function ProfilerDemo() {
  const [sortKey, setSortKey] = useState(null)

  return (
    <div className="app-light">
      <div className="panel-light">
        <h1>🎬 CineCart Dashboard</h1>
        <p>Try sorting the table — notice anything?</p>
        <MovieTable sortKey={sortKey} onSort={setSortKey} />
        <CartWidget />
      </div>
    </div>
  )
}

function MovieTable({ sortKey, onSort }) {
  // 🐛 sleep is inside useMemo — React sees it as render work
  // Profiler will show this component as slow when sorting
  const movies = useMemo(() => {
    if (!sortKey) return initialMovies
    sleep(3000)
    return [...initialMovies].sort((a, b) => {
      if (typeof a[sortKey] === 'string') return a[sortKey].localeCompare(b[sortKey])
      return b[sortKey] - a[sortKey]
    })
  }, [sortKey])

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' },
    { key: 'rating', label: 'Rating' },
    { key: 'tickets', label: 'Tickets Sold' },
  ]

  return (
    <table className="movie-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>
              {col.label}
              <button
                className={sortKey === col.key ? 'sort-btn active' : 'sort-btn'}
                onClick={() => onSort(col.key)}
              >
                ↕
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {movies.map(movie => (
          <MovieRow key={movie.id} movie={movie} />
        ))}
      </tbody>
    </table>
  )
}

function MovieRow({ movie }) {
  return (
    <tr>
      <td>{movie.title}</td>
      <td>{movie.year}</td>
      <td>⭐ {movie.rating}</td>
      <td>{movie.tickets.toLocaleString()}</td>
    </tr>
  )
}

function CartWidget() {
  const [count, setCount] = useState(0)
  return (
    <div className="cart-widget">
      <p>🛒 Items in cart: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>Add Ticket</button>
      <button onClick={() => setCount(0)}>Clear</button>
    </div>
  )
}

import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-xl">
        Notes App
      </Link>

      <Link to="/activity-logs" className="text-blue-600 hover:underline">
        <button className="border px-4 py-2 bg-slate-500 text-black hover:bg-slate-400">Activity Logs</button>
      </Link>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search notes..."
        className="border p-2 rounded w-1/3"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {user && (
        <div className="flex gap-4 items-center">
          <span>{user.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

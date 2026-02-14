import { useEffect, useState, useMemo } from "react"
import API from "../api/axios"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch all notes once
  useEffect(() => {
    API.get("/notes").then(res => setNotes(res.data))
  }, [])

  // Compute filtered notes
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, notes])

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">My Notes</h2>
          <Link
            to="/editor/new"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <Link
              key={note.id}
              to={`/editor/${note.id}`}
              className="bg-white p-4 rounded shadow hover:shadow-lg"
            >
              <h4 className="font-semibold">{note.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

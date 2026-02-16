import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../api/axios"
import { io } from "socket.io-client"
import Navbar from "../components/Navbar"

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const socketRef = useRef(null)

  const [note, setNote] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  // Collaborator state
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("VIEWER")

  useEffect(() => {
    if (id === "new") {
    setCanEdit(true)
    setIsOwner(true)
    return
  }

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${id}`)
        setNote(res.data)
        setTitle(res.data.title)
        setContent(res.data.content)
        setIsOwner(res.data.isOwner)
        setCanEdit(res.data.canEdit)

        socket.emit("join-note", id)
      } catch (err) {
        console.log("ERROR RESPONSE:", err.response?.data)
      }
    }

    fetchNote()

    socket.on("receive-edit", (data) => {
      setContent(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [id])

  const handleChange = (e) => {
    if (!canEdit) return

    setContent(e.target.value)

    if (socketRef.current) {
      socketRef.current.emit("edit-note", {
        noteId: id,
        content: e.target.value,
      })
    }
  }

  const handleSave = async () => {
    try {
      if (id === "new") {
        await API.post("/notes", { title, content })
      } else {
        await API.put(`/notes/${id}`, { title, content })
      }

      alert("Saved!")
      navigate("/dashboard")
    } catch (err) {
      alert(err.response?.data?.message || "Error saving note")
    }
  }

  const handleGenerateLink = async () => {
    try {
      const res = await API.post(`/notes/${id}/share`)
      alert(`Shareable Link: ${res.data.shareUrl}`)
    } catch (err) {
      console.log(err)
      alert("Failed to generate link")
    }
  }

  const handleAddCollaborator = async () => {
    try {
      await API.post(`/notes/${id}/collaborators`, {
        email,
        permission,
      })

      alert("Collaborator added")

      // Optional: refresh note
      const res = await API.get(`/notes/${id}`)
      setNote(res.data)

      setEmail("")
      setPermission("VIEWER")
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add collaborator")
    }
  }

  const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this note?")) return

  try {
    await API.delete(`/notes/${id}`)
    alert("Note deleted")
    navigate("/dashboard")
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete note")
  }
}

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen space-y-4">

          <div className="flex justify-end">
    {isOwner && id !== "new" && (
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Note
      </button>
    )}
  </div>
  
        <input
          className="w-full border p-2 rounded text-xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          disabled={!canEdit}
        />

        <textarea
          className="w-full border p-4 rounded h-96"
          value={content}
          onChange={handleChange}
          disabled={!canEdit}
        />

        <div className="flex gap-3 flex-wrap">
          {canEdit && (
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Save
            </button>
          )}

          {isOwner && (
            <>
              <button
                onClick={handleGenerateLink}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Generate Share Link
              </button>

              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  placeholder="Collaborator email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded"
                />

                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                </select>

                <button
                  onClick={handleAddCollaborator}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Collaborator
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

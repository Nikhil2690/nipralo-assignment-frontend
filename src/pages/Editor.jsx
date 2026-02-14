
import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../api/axios"
import { io } from "socket.io-client"
import Navbar from "../components/Navbar"

//const socket = io(import.meta.env.VITE_SOCKET_URL)

export default function Editor() {
  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const socketRef = useRef();

  const navigate = useNavigate()


  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket", "polling"], // ensures fallback
  });

   socketRef.current = socket;

    if (id !== "new") {
      API.get(`/notes/${id}`)
  .then(res => {
    console.log("SUCCESS:", res.data)
    setTitle(res.data.title)
    setContent(res.data.content)
  })
  .catch(err => {
    console.log("ERROR RESPONSE:", err.response?.data)
  })

      socket.emit("join-note", id)

      socket.on("receive-edit", (data) => {
        console.log("SOCKET DATA:", data)
        setContent(data)
      })
    }

    return () => socket.off("receive-edit")
  }, [id])

  const handleChange = (e) => {
    setContent(e.target.value)
    if (socketRef.current) {
      socketRef.current.emit("edit-note", { noteId: id, content: e.target.value });
    }
  }

const handleSave = async () => {
  console.log("Saving note:", { title, content, id }) // always log

  try {
    if (id === "new") {
      await API.post("/notes", { title, content })
    } else {
      await API.put(`/notes/${id}`, { title, content })
    }
    alert("Saved!")
    navigate("/dashboard")
  } catch (err) {
    console.error("Save failed:", err)
    alert(err.response?.data?.message || "Error saving note")
  }
}


  const handleGenerateLink = async () => {
  try {
    const res = await API.post(`/notes/${id}/share`);
    console.log(res)
    alert(`Shareable Link: ${res.data.shareUrl}`);
  } catch (err) {
    console.error(err);
    alert("Failed to generate link");
  }
};

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen space-y-4">
        <input
          className="w-full border p-2 rounded text-xl"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="w-full border p-4 rounded h-96"
          value={content}
          onChange={handleChange}
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save
        </button>

        <button onClick={handleGenerateLink} className="bg-gray-600 text-white px-4 py-2 ml-3 rounded">
        Generate Share Link
        </button>
      </div>
    </>
  )
}

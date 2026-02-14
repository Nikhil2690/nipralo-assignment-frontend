
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axios"

export default function ShareNote() {
  const { token } = useParams()
  const [note, setNote] = useState(null)
  const [error, setError] = useState("");

 useEffect(() => {
    API.get(`/notes/public/${token}`)
      .then(res => setNote(res.data))
      .catch(() => setError("Invalid or expired link"));
  }, [token]);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!note) return <div>Loading...</div>

  return (
    <div className="p-8 m-8 w-1/2 border shadow-md ">
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <p className="mt-4 whitespace-pre-line">{note.content}</p>
    </div>
  )
}

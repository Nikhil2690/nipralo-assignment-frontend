

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/axios"

export default function PublicView() {
  const { token } = useParams()
  const [note, setNote] = useState(null)

  useEffect(() => {
    API.get(`/notes/public/${token}`).then(res => setNote(res.data))
  }, [token])

  if (!note) return <p>Loading...</p>

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{note.title}</h2>
      <p>{note.content}</p>
    </div>
  )
}

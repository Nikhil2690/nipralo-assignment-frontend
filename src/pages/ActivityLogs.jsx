// src/pages/ActivityLogs.jsx
import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    API.get("/activity-logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>
        {logs.length === 0 ? (
          <div>No activity yet.</div>
        ) : (
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="p-4 border rounded bg-white shadow">
                <p>
                  <span className="font-semibold">{log.user.email}</span>{" "}
                  {log.action} note{" "}
                  <span className="font-semibold">{log.note.title}</span>{" "}
                  at {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

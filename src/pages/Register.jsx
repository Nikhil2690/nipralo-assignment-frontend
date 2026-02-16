
import { useState } from "react"
import API from "../api/axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  
  e.preventDefault()

  try {
    setLoading(true);
    await API.post("/auth/register", { name, email, password })
    navigate("/")
  } catch (err) {
    console.log(err.response?.data)
    alert(err.response?.data?.message || "Registration failed")
  } finally {
    setLoading(false)
  }
}



  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>


        <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  )
}

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const contentType = response.headers.get("content-type")

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server responded with ${response.status}: ${errorText}`)
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        if (data.token) {
          localStorage.setItem("token", data.token)
          navigate("/cultural-heritage", { replace: true })
        } else {
          setError(data.message || "Invalid credentials")
        }
      } else {
        const errorText = await response.text()
        throw new Error(`Unexpected response format: ${errorText}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container glass-effect">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to explore Nepal's Cultural Heritage</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Login"}
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login;


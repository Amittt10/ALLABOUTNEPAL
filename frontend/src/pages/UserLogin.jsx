import { useState } from "react"
import "./Login.css"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
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
          console.log("✅ Login successful")
          navigate("/App")
        } else {
          alert("❌ Login failed: " + (data.message || "Invalid credentials"))
        }
      } else {
        const errorText = await response.text()
        throw new Error(`❌ Unexpected response format: ${errorText}`)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed: " + error.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="signup-link">
            Don't have an account? <Link to="/">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login

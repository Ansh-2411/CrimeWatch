"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import "../styles/Auth.css"
import "../styles/theme.css"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    console.log(formData)
    try {
      const response = await fetch("http://localhost:4000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data)
  
      // Assume the API returns something like { username, role, id }
      login({
        username: data.user.userName,
        role: data.user.rank,
        id: data.user.id,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-logo">
          <div className="logo-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
        </div>
        <h2>Police Case Management System</h2>
        <h3>Sign in to your account</h3>

        {errors.general && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              placeholder="Enter your username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login


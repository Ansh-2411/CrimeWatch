"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import "../styles/Auth.css"
import "../styles/theme.css"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PI", 
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)

      // Auto login after successful registration
      setTimeout(() => {
        login({ username: formData.username, role: formData.role, id: formData.username })
        navigate("/dashboard")
      }, 2000)
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-logo">
          <div className="logo-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
        </div>
        <h2>Police Case Management System</h2>
        <h3>Create a new account</h3>

        {success ? (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <div>
              <h4>Registration successful!</h4>
              <p>Your account has been created. You will be redirected to the dashboard shortly.</p>
            </div>
          </div>
        ) : (
          <>
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
                  placeholder="Choose a username"
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
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
                  placeholder="Create a password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                  <option value="PI">Police Inspector (PI)</option>
                  <option value="PSI">Police Sub-Inspector (PSI)</option>
                  <option value="DSP">Deputy Superintendent of Police (DSP)</option>
                  <option value="IPS">Indian Police Service (IPS)</option>
                  <option value="HEAD_CONSTABLE">Head Constable</option>
                  <option value="CONSTABLE">Constable</option>
                </select>
                <p className="help-text">Note: Higher roles require approval from administrators</p>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register


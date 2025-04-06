"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import Sidebar from "./Sidebar.jsx"
import "../styles/CreateUser.css"
import "../styles/theme.css"
import axios from "axios"

const CreateUser = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rank: getDefaultRole(currentUser.rank),
    badgeNumber: "",
    fullName: "",
    gender: "",
    contactNumber: "",
    address: "",
    joiningDate: new Date().toISOString().split('T')[0],
    stationId: currentUser.station || null,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function getDefaultRole(currentRole) {
    switch (currentRole) {
      case "ADMIN": return "IPS"
      case "IPS": return "DSP"
      case "DSP": return "PI"
      case "PI": return "PSI"
      case "PSI": return "HEAD_CONSTABLE"
      case "HEAD_CONSTABLE": return "CONSTABLE"
      default: return ""
    }
  }

  function getAvailableRoles(currentRole) {
    switch (currentRole) {
      case "ADMIN": return [{ value: "IPS", label: "IPS" }]
      case "IPS": return [{ value: "DSP", label: "DSP" }]
      case "DSP": return [{ value: "PI", label: "PI" }]
      case "PI": return [{ value: "PSI", label: "PSI" }]
      case "PSI": return [{ value: "HEAD_CONSTABLE", label: "HEAD CONSTABLE" }]
      case "HEAD_CONSTABLE": return [{ value: "CONSTABLE", label: "CONSTABLE" }]
      default: return []
    }
  }

  function getRankLevel(rank) {
    const levels = {
      ADMIN: 0,
      DGP: 1,
      DIG: 2,
      IPS: 3,
      DSP: 4,
      PI: 5,
      PSI: 6,
      HEAD_CONSTABLE: 7,
      CONSTABLE: 8,
    }
    return levels[rank] ?? 99
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.userName.trim()) newErrors.userName = "Username is required"
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.badgeNumber.trim()) newErrors.badgeNumber = "Badge number is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.joiningDate) newErrors.joiningDate = "Joining date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const payload = {
        userName: formData.userName,
        password: formData.password,
        fullName: formData.fullName,
        badgeNumber: formData.badgeNumber,
        rank: formData.rank,
        rankLevel: getRankLevel(formData.rank),
        superiorId: currentUser.id,
        stationId: formData.stationId,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        email: formData.email,
        address: formData.address,
        joiningDate: formData.joiningDate,
      }

      const res = await axios.post("http://localhost:4000/admin/register", payload)

      if (res.status === 201) {
        console.log("✅ User registered:", res.data.user)
        setSuccess(true)
        setFormData({
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
          rank: getDefaultRole(currentUser.rank),
          badgeNumber: "",
          fullName: "",
          gender: "",
          contactNumber: "",
          address: "",
          joiningDate: new Date().toISOString().split('T')[0],
          stationId: currentUser.station || null,
        })
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      const msg = error.response?.data?.msg || "Something went wrong"
      setErrors({ general: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const availableRoles = getAvailableRoles(currentUser.rank)

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Create New User</h1>
        </header>

        <div className="create-user-content">
          <div className="create-user-form-container">
            <h2>Create a new {formData.rank} user</h2>
            <p className="form-description">
              As a {currentUser.rank}, you can create {formData.rank} users who report to you.
            </p>

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <span>User created successfully!</span>
              </div>
            )}

            {errors.general && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="create-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name*</label>
                  <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="badgeNumber">Badge Number*</label>
                  <input id="badgeNumber" name="badgeNumber" value={formData.badgeNumber} onChange={handleChange} placeholder="Enter badge number" />
                  {errors.badgeNumber && <span className="error-text">{errors.badgeNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="userName">Username*</label>
                  <input id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder="Enter username" />
                  {errors.userName && <span className="error-text">{errors.userName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rank">Rank*</label>
                  <input id="rank" value={formData.rank} onChange={handleChange}  name="rank" type="text"  placeholder="Enter Rank" />

                  {/* <select id="rank" name="rank" value={formData.rank} onChange={handleChange} className="form-select">
                    {availableRoles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select> */}
                </div>

                <div className="form-group">
                  <label htmlFor="joiningDate">Joining Date*</label>
                  <input id="joiningDate" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
                  {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter contact number" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Creating...</>) : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
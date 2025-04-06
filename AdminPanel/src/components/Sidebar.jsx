"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import "../styles/Sidebar.css"

const Sidebar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Define which roles can create new users
  const canCreateUsers = ["ADMIN", "IPS", "DSP", "PI", "PSI", "HEAD_CONSTABLE"].includes(currentUser.role)

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-shield-alt"></i>
          <span>CrimeWatch</span>
        </div>
      </div>

      <div className="sidebar-menu">
        <ul>
          <li>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {canCreateUsers && (
            <li>
              <Link to="/create-user" className={location.pathname === "/create-user" ? "active" : ""}>
                <i className="fas fa-user-plus"></i>
                <span>Create User</span>
              </Link>
            </li>
          )}

          <li>
            <button onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{currentUser.username.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{currentUser.username}</p>
            <p className="user-role">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar


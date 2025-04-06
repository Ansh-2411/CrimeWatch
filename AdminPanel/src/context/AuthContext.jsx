"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setCurrentUser(userData)
    console.log(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    currentUser,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


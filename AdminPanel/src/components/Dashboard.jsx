"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import Sidebar from "./Sidebar.jsx"
import { mockCases, mockUsers } from "../data/mockData.js"
import "../styles/Dashboard.css"
import "../styles/theme.css"
// Add this import at the top of the file
import "../styles/CaseForm.css"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    solvedByMe: 0,
    solvedUnderMe: 0,
  })
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [subordinates, setSubordinates] = useState([])
  const [selectedSubordinate, setSelectedSubordinate] = useState(null)
  const [filterPath, setFilterPath] = useState([])

  // Add these state variables at the beginning of the Dashboard component
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Role hierarchy mapping
  const roleHierarchy = {
    ADMIN: ["IPS"],
    IPS: ["DSP"],
    DSP: ["PI"],
    PI: ["PSI"],
    PSI: ["HEAD_CONSTABLE"],
    HEAD_CONSTABLE: ["CONSTABLE"],
    CONSTABLE: [],
  }

  // Role display names
  const roleNames = {
    ADMIN: "Administrator",
    IPS: "Indian Police Service",
    DSP: "Deputy Superintendent",
    PI: "Police Inspector",
    PSI: "Police Sub-Inspector",
    HEAD_CONSTABLE: "Head Constable",
    CONSTABLE: "Constable",
  }

  useEffect(() => {
    // Reset filter path when user changes
    setFilterPath([{ id: currentUser.id, username: currentUser.username, role: currentUser.role }])
    setSelectedSubordinate(null)

    // Get cases based on user role
    loadCasesForRole(currentUser.role, currentUser.username)

    // Load subordinates for the current user
    loadSubordinates(currentUser.role)

    // Calculate statistics
    calculateStats(currentUser.role, currentUser.username)

    // Add a style element for the scrollable table
    const style = document.createElement("style")
    style.innerHTML = `
      .table-container {
        max-height: 500px;
        overflow-y: auto;
      }
      .reports-table {
        width: 100%;
      }
      .reports-table thead {
        position: sticky;
        top: 0;
        background-color: #f8f9fa;
        z-index: 1;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [currentUser])

  const loadCasesForRole = (role, username) => {
    // Get cases assigned to this role
    const roleCases = mockCases.filter((c) => c.assignedTo === role || (c.status && c.status.includes(role)))

    setCases(roleCases)
    setFilteredCases(roleCases)
  }

  const loadSubordinates = (role) => {
    // Get direct subordinate roles
    const subordinateRoles = roleHierarchy[role] || []

    // Filter users based on subordinate roles
    const filteredSubordinates = mockUsers.filter((user) => subordinateRoles.includes(user.role))

    setSubordinates(filteredSubordinates)
  }

  const calculateStats = (role, username) => {
    // Get all cases in the system
    const allCases = mockCases

    // Role hierarchy for filtering
    const roleHierarchyList = ["CONSTABLE", "HEAD_CONSTABLE", "PSI", "PI", "DSP", "IPS", "ADMIN"]
    const currentRoleIndex = roleHierarchyList.indexOf(role)

    // Cases assigned to current user's role
    const assignedToMyRole = allCases.filter((c) => roleHierarchyList.indexOf(c.assignedTo) === currentRoleIndex)

    // Cases assigned to roles below current user
    const assignedToLowerRoles = allCases.filter((c) => roleHierarchyList.indexOf(c.assignedTo) < currentRoleIndex)

    // Total cases under supervision (my role + lower roles)
    const totalCases = assignedToMyRole.length + assignedToLowerRoles.length

    // Active cases (not resolved)
    const activeCases = [...assignedToMyRole, ...assignedToLowerRoles].filter(
      (c) => !c.status.includes("RESOLVED") && !c.status.includes("TAKEN"),
    ).length

    // Resolved cases
    const resolvedCases = [...assignedToMyRole, ...assignedToLowerRoles].filter(
      (c) => c.status.includes("RESOLVED") || c.status.includes("TAKEN"),
    ).length

    // Cases solved by me
    const solvedByMe = [...assignedToMyRole, ...assignedToLowerRoles].filter((c) => c.handledBy === username).length

    // Cases solved under me but not by me
    const solvedUnderMe = [...assignedToMyRole, ...assignedToLowerRoles].filter(
      (c) => c.handledBy && c.handledBy !== username,
    ).length

    setStats({
      totalCases,
      activeCases,
      resolvedCases,
      solvedByMe,
      solvedUnderMe,
    })
  }

  const handleSubordinateSelect = (subordinate) => {
    setSelectedSubordinate(subordinate)

    // Update filter path
    setFilterPath([...filterPath, subordinate])

    // Load cases for this subordinate
    const subordinateCases = mockCases.filter(
      (c) => c.assignedTo === subordinate.role || c.officerId === subordinate.id,
    )

    setFilteredCases(subordinateCases)

    // Load subordinates for this user
    const subRoles = roleHierarchy[subordinate.role] || []
    const subs = mockUsers.filter((user) => subRoles.includes(user.role))

    setSubordinates(subs)
  }

  const handleFilterPathClick = (index) => {
    if (index === filterPath.length - 1) return // Already at this level

    const user = filterPath[index]

    setFilterPath(filterPath.slice(0, index + 1))

    if (index === 0) {
      setSelectedSubordinate(null)
      loadCasesForRole(currentUser.role, currentUser.username)
      loadSubordinates(currentUser.role)
    } else {
      setSelectedSubordinate(user)

      const userCases = mockCases.filter((c) => c.assignedTo === user.role || c.officerId === user.id)

      setFilteredCases(userCases)

      const subRoles = roleHierarchy[user.role] || []
      const subs = mockUsers.filter((u) => subRoles.includes(u.role))

      setSubordinates(subs)
    }
  }

  // Handle case assignment
  const handleAssignCase = (caseId, role) => {
    console.log(`Assigning case ${caseId} to ${role}`)
    alert(`Case #${caseId} has been assigned to ${role}`)
  }

  // Handle taking a case
  const handleTakeCase = (caseId) => {
    console.log(`Taking case ${caseId}`)
    alert(`You have taken Case #${caseId}`)
  }

  // Get action buttons based on user role
  const getCaseActions = (caseItem) => {
    switch (currentUser.role) {
      case "PSI":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleAssignCase(caseItem.id, "PI")}
              className="btn-assign"
            >
              Assign to HEAD CONSTABLE
            </button>
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "PI":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleAssignCase(caseItem.id, "DSP")}
              className="btn-assign"
            >
              Assign to DSP
            </button>
            <button
              onClick={() => handleAssignCase(caseItem.id, "PSI")}
              className="btn-assign"
            >
              Assign to PSI
            </button>
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "DSP":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleAssignCase(caseItem.id, "ADMIN")}
              className="btn-assign"
            >
              Assign to IPS
            </button>
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "IPS":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleAssignCase(caseItem.id, "ADMIN")}
              className="btn-assign"
            >
              Assign to Admin
            </button>
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "ADMIN":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "HEAD_CONSTABLE":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleAssignCase(caseItem.id, "CONSTABLE")}
              className="btn-assign"
            >
              Assign to Constable
            </button>
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      case "CONSTABLE":
        return (
          <div className="table-actions">
            <button
              onClick={() => handleTakeCase(caseItem.id)}
              className="btn-take"
            >
              Take Case
            </button>
          </div>
        )
      default:
        return null
    }
  }

  const handlePreviewCase = (caseId) => {
    console.log(`Preview case ${caseId}`)
    alert(`Viewing details for Case #${caseId}`)
  }

  // Add this function to handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Add this function to get paginated cases
  const getPaginatedCases = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredCases.slice(indexOfFirstItem, indexOfLastItem)
  }

  // Add this to calculate total pages
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <header className="dashboard-header">
          <h1>{roleNames[currentUser.role]} Dashboard</h1>
        </header>

        <div className="dashboard-content">
          {currentUser.role !== "PSI" && (
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-folder"></i>
                </div>
                <div className="stat-details">
                  <h3>Total Cases</h3>
                  <p>{stats.totalCases}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon yellow">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h3>Active Cases</h3>
                  <p>{stats.activeCases}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3>Resolved Cases</h3>
                  <p>{stats.resolvedCases}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="stat-details">
                  <h3>Solved by Me</h3>
                  <p>{stats.solvedByMe}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon red">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h3>Solved Under Me</h3>
                  <p>{stats.solvedUnderMe}</p>
                </div>
              </div>
            </div>
          )}

          <div className="filter-section">
            <div className="filter-header">
              <h2>Filter Reports</h2>
            </div>

            <div className="filter-body">
              <div className="filter-breadcrumb">
                {filterPath.map((item, index) => (
                  <div key={item.id} className="filter-breadcrumb-item">
                    {index === filterPath.length - 1 ? (
                      <span className="filter-breadcrumb-current">
                        {item.username} ({item.role})
                      </span>
                    ) : (
                      <span className="filter-breadcrumb-link" onClick={() => handleFilterPathClick(index)}>
                        {item.username} ({item.role})
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {subordinates.length > 0 && (
                <div className="filter-row">
                  <div className="filter-label">Subordinates:</div>
                  <div className="filter-options">
                    {subordinates.map((sub) => (
                      <div
                        key={sub.id}
                        className={`filter-option ${selectedSubordinate?.id === sub.id ? "active" : ""}`}
                        onClick={() => handleSubordinateSelect(sub)}
                      >
                        {sub.username}
                        <span className="badge">{sub.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="reports-section">
            <div className="reports-header">
              <h2>Case Management</h2>
              <div className="reports-actions">
                <select className="form-select" style={{ width: "200px" }}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="table reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Case Details</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Reported Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedCases().length === 0 ? (
                    <tr>
                      <td colSpan="6" className="table-empty">
                        <div>
                          <i className="fas fa-folder-open" style={{ fontSize: "32px", marginBottom: "12px" }}></i>
                          <p>No cases found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    getPaginatedCases().map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td>#{caseItem.id}</td>
                        <td>
                          <div className="case-title">{caseItem.title}</div>
                          <div className="case-description">{caseItem.description}</div>
                          <div className="case-meta"></div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(caseItem.status)}`}>
                            {formatStatus(caseItem.status)}
                          </span>
                        </td>
                        <td>{caseItem.location}</td>
                        <td>{formatDate(caseItem.reportedDate)}</td>
                        <td>
                          {getCaseActions(caseItem)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`pagination-btn ${currentPage === number ? "active" : ""}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add the missing getSeverityBadgeClass function that was referenced in the code
const getSeverityBadgeClass = (severity) => {
  switch (severity) {
    case "HIGH":
      return "badge-danger"
    case "MEDIUM":
      return "badge-warning"
    case "LOW":
      return "badge-success"
    default:
      return "badge-secondary"
  }
}

// Helper functions
const getStatusBadgeClass = (status) => {
  if (status.includes("TAKEN") || status.includes("RESOLVED")) {
    return "badge-success"
  } else if (status.includes("PENDING")) {
    return "badge-warning"
  } else if (status.includes("PROGRESS")) {
    return "badge-info"
  } else {
    return "badge-secondary"
  }
}

const formatStatus = (status) => {
  return status.replace(/_/g, " ").replace(/PENDING_/g, "Pending ")
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default Dashboard

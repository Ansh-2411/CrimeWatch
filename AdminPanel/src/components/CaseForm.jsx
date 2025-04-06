"use client"

const CaseList = ({ cases, userRole, onAssign, onTake }) => {
  // Determine which actions to show based on user role
  const getActions = (caseItem) => {
    switch (userRole) {
      case "PSI":
        return (
          <div className="case-actions">
            <button onClick={() => onAssign(caseItem.id, "PI")} className="btn-assign">
              Assign to PI
            </button>
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "PI":
        return (
          <div className="case-actions">
            <button onClick={() => onAssign(caseItem.id, "DSP")} className="btn-assign">
              Assign to DSP
            </button>
            <button onClick={() => onAssign(caseItem.id, "PSI")} className="btn-assign">
              Assign to PSI
            </button>
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "DSP":
        return (
          <div className="case-actions">
            <button onClick={() => onAssign(caseItem.id, "ADMIN")} className="btn-assign">
              Assign to Admin
            </button>
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "IPS":
        return (
          <div className="case-actions">
            <button onClick={() => onAssign(caseItem.id, "ADMIN")} className="btn-assign">
              Assign to Admin
            </button>
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "ADMIN":
        return (
          <div className="case-actions">
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "HEAD_CONSTABLE":
        return (
          <div className="case-actions">
            <button onClick={() => onAssign(caseItem.id, "CONSTABLE")} className="btn-assign">
              Assign to Constable
            </button>
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      case "CONSTABLE":
        return (
          <div className="case-actions">
            <button onClick={() => onTake(caseItem.id)} className="btn-take">
              Take Case
            </button>
          </div>
        )
      default:
        return null
    }
  }

  // Get severity badge class
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    if (status.includes("TAKEN")) {
      return "badge-success"
    } else if (status.includes("PENDING")) {
      return "badge-warning"
    } else {
      return "badge-info"
    }
  }

  return (
    <div className="case-list-container">
      <ul className="case-list">
        {cases.length === 0 ? (
          <li className="case-empty">No cases found</li>
        ) : (
          cases.map((caseItem) => (
            <li key={caseItem.id} className="case-item">
              <div className="case-content">
                <div className="case-header">
                  <h3 className="case-title">
                    Case #{caseItem.id}: {caseItem.title}
                  </h3>
                  <span className={`badge ${getSeverityBadgeClass(caseItem.severity)}`}>{caseItem.severity}</span>
                </div>
                <p className="case-description">{caseItem.description}</p>
                <div className="case-meta">
                  <span className={`badge ${getStatusBadgeClass(caseItem.status)}`}>
                    {caseItem.status.replace(/_/g, " ")}
                  </span>
                  <span className="badge badge-secondary">Location: {caseItem.location}</span>
                  <span className="badge badge-secondary">
                    Reported: {new Date(caseItem.reportedDate).toLocaleDateString()}
                  </span>
                  {caseItem.handledBy && <span className="badge badge-info">Handled by: {caseItem.handledBy}</span>}
                </div>
              </div>
              <div className="case-action-container">{getActions(caseItem)}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default CaseList


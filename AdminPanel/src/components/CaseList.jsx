"use client"

const CaseList = ({ cases, userRole, onPreview }) => {
  // Get severity badge class

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    if (status.includes("TAKEN")) {
      return "badge badge-success"
    } else if (status.includes("PENDING")) {
      return "badge badge-warning"
    } else {
      return "badge badge-info"
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        {cases.length === 0 ? (
          <div className="text-center p-4">
            <i
              className="fas fa-folder-open"
              style={{ fontSize: "32px", color: "var(--text-secondary)", marginBottom: "16px" }}
            ></i>
            <p className="text-center" style={{ color: "var(--text-secondary)" }}>
              No cases found
            </p>
          </div>
        ) : (
          <ul className="case-list">
            {cases.map((caseItem) => (
              <li key={caseItem.id} className="case-item">
                <div className="case-header">
                  <div className="case-title-section">
                    <h3 className="case-title">
                      Case #{caseItem.id}: {caseItem.title}
                    </h3>
                    <span className={getSeverityBadgeClass(caseItem.severity)}>{caseItem.severity}</span>
                  </div>
                </div>

                <div className="case-body">
                  <p className="case-description">{caseItem.description}</p>

                  <div className="case-meta">
                    <span className={getStatusBadgeClass(caseItem.status)}>{caseItem.status.replace(/_/g, " ")}</span>
                    <span className="badge badge-secondary">Location: {caseItem.location}</span>
                    <span className="badge badge-secondary">
                      Reported: {new Date(caseItem.reportedDate).toLocaleDateString()}
                    </span>
                    {caseItem.handledBy && <span className="badge badge-info">Handled by: {caseItem.handledBy}</span>}
                  </div>
                </div>

                <div className="case-actions">
                  <button className="btn btn-primary" onClick={() => onPreview(caseItem.id)}>
                    <i className="fas fa-eye btn-icon"></i>
                    Preview
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CaseList


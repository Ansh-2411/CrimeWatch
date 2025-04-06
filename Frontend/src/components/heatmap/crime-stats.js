// Mock data for demonstration
const crimeStats = {
    total: 243,
    byType: {
        Theft: 98,
        Assault: 45,
        Vandalism: 67,
        "Suspicious Activity": 23,
        Other: 10,
    },
    byStatus: {
        submitted: 32,
        received: 28,
        under_review: 45,
        approved: 38,
        investigating: 56,
        resolved: 29,
        closed: 12,
        rejected: 3,
    },
    recentTrend: [12, 18, 15, 22, 19, 24, 28],
}

const CrimeStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Reports</h3>
                <p className="text-2xl font-bold">{crimeStats.total}</p>
                <div className="mt-2 text-xs text-green-600">+12% from last month</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Most Common</h3>
                <p className="text-2xl font-bold">Theft</p>
                <div className="mt-2 text-xs">
                    {crimeStats.byType.Theft} reports ({Math.round((crimeStats.byType.Theft / crimeStats.total) * 100)}%)
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Under Investigation</h3>
                <p className="text-2xl font-bold">{crimeStats.byStatus.investigating}</p>
                <div className="mt-2 text-xs">
                    {Math.round((crimeStats.byStatus.investigating / crimeStats.total) * 100)}% of all reports
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                <p className="text-2xl font-bold">{crimeStats.byStatus.resolved + crimeStats.byStatus.closed}</p>
                <div className="mt-2 text-xs text-green-600">
                    {Math.round(((crimeStats.byStatus.resolved + crimeStats.byStatus.closed) / crimeStats.total) * 100)}%
                    resolution rate
                </div>
            </div>
        </div>
    )
}

export default CrimeStats


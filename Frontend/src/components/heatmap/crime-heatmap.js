"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Shield, AlertTriangle, Bomb, Eye, HelpCircle } from "lucide-react"

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Mock data for demonstration - in a real app, this would come from your API
const mockCrimeData = [
    {
        reportId: "1",
        crimetype: "Theft",
        location: {
            coordinates: [77.209, 28.6139], // Delhi
            address: "Connaught Place, Delhi",
        },
        crimeDate: new Date("2023-12-01"),
        status: "resolved",
        description: "Mobile phone snatched near metro station",
    },
    {
        reportId: "2",
        crimetype: "Vandalism",
        location: {
            coordinates: [77.231, 28.6129], // Near Delhi
            address: "Nizamuddin, Delhi",
        },
        crimeDate: new Date("2023-12-05"),
        status: "investigating",
        description: "Wall graffiti on government property",
    },
    {
        reportId: "3",
        crimetype: "Assault",
        location: {
            coordinates: [77.1855, 28.5245], // South Delhi
            address: "Mehrauli, Delhi",
        },
        crimeDate: new Date("2023-12-10"),
        status: "under_review",
        description: "Fight between two groups near market",
    },
    {
        reportId: "4",
        crimetype: "Theft",
        location: {
            coordinates: [77.209, 28.6339], // North Delhi
            address: "Chandni Chowk, Delhi",
        },
        crimeDate: new Date("2023-12-12"),
        status: "received",
        description: "Wallet stolen in crowded market",
    },
    {
        reportId: "5",
        crimetype: "Suspicious Activity",
        location: {
            coordinates: [77.1795, 28.5485], // West Delhi
            address: "Dwarka, Delhi",
        },
        crimeDate: new Date("2023-12-15"),
        status: "submitted",
        description: "Unknown person loitering around residential area",
    },
    {
        reportId: "6",
        crimetype: "Theft",
        location: {
            coordinates: [77.23, 28.6429], // East Delhi
            address: "Laxmi Nagar, Delhi",
        },
        crimeDate: new Date("2023-12-18"),
        status: "investigating",
        description: "Car break-in reported in parking lot",
    },
    {
        reportId: "7",
        crimetype: "Vandalism",
        location: {
            coordinates: [77.1143, 28.7041], // Northwest Delhi
            address: "Rohini, Delhi",
        },
        crimeDate: new Date("2023-12-20"),
        status: "approved",
        description: "Bus stop shelter damaged",
    },
    {
        reportId: "8",
        crimetype: "Assault",
        location: {
            coordinates: [77.281, 28.567], // Southeast Delhi
            address: "Kalkaji, Delhi",
        },
        crimeDate: new Date("2023-12-22"),
        status: "under_review",
        description: "Altercation between neighbors",
    },
    {
        reportId: "9",
        crimetype: "Other",
        location: {
            coordinates: [77.1734, 28.7324], // North Delhi
            address: "Model Town, Delhi",
        },
        crimeDate: new Date("2023-12-25"),
        status: "submitted",
        description: "Noise complaint from unauthorized party",
    },
    {
        reportId: "10",
        crimetype: "Suspicious Activity",
        location: {
            coordinates: [77.2249, 28.6353], // Central Delhi
            address: "Karol Bagh, Delhi",
        },
        crimeDate: new Date("2023-12-28"),
        status: "received",
        description: "Suspicious package left unattended",
    },
]

// Generate more data points around a center point
const generateDataPoints = (centerLat, centerLng, count = 50, radius = 0.05) => {
    const points = []
    for (let i = 0; i < count; i++) {
        // Random angle and distance
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * radius

        // Calculate new point
        const lat = centerLat + distance * Math.cos(angle)
        const lng = centerLng + distance * Math.sin(angle)

        // Random crime type
        const crimeTypes = ["Theft", "Assault", "Vandalism", "Suspicious Activity", "Other"]
        const crimetype = crimeTypes[Math.floor(Math.random() * crimeTypes.length)]

        // Random status
        const statuses = [
            "submitted",
            "received",
            "under_review",
            "approved",
            "investigating",
            "resolved",
            "closed",
            "rejected",
        ]
        const status = statuses[Math.floor(Math.random() * statuses.length)]

        // Random date within last 3 months
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 90))

        // Random descriptions based on crime type
        let description = ""
        switch (crimetype) {
            case "Theft":
                const stolenItems = ["wallet", "mobile phone", "bicycle", "laptop", "bag"]
                description = `${stolenItems[Math.floor(Math.random() * stolenItems.length)]} stolen`
                break
            case "Assault":
                description = "Physical altercation between individuals"
                break
            case "Vandalism":
                const vandalisedItems = ["wall", "car", "shop window", "public property", "signage"]
                description = `${vandalisedItems[Math.floor(Math.random() * vandalisedItems.length)]} damaged`
                break
            case "Suspicious Activity":
                description = "Unusual behavior reported by residents"
                break
            default:
                description = "Incident reported by local resident"
        }

        points.push({
            reportId: `gen-${i}`,
            crimetype,
            location: {
                coordinates: [lng, lat], // [longitude, latitude]
                address: `Generated Location ${i}`,
            },
            crimeDate: date,
            status,
            description,
        })
    }
    return points
}

// Main CrimeHeatmap component
const CrimeHeatmap = () => {
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [timeRange, setTimeRange] = useState("all")
    const [initialLocation, setInitialLocation] = useState([28.6139, 77.209]) // Default Delhi
    const [crimeData, setCrimeData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSidebar, setShowSidebar] = useState(true)
    const [mapZoom, setMapZoom] = useState(12)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [hoveredCrime, setHoveredCrime] = useState(null)

    // Initialize with mock data
    useEffect(() => {
        // Generate crime data around Delhi
        const generatedData = generateDataPoints(28.6139, 77.209, 100, 0.1)
        setCrimeData([...mockCrimeData, ...generatedData])
        setLoading(false)
    }, [])

    // Filter data based on selected filters
    const filteredData = crimeData.filter((crime) => {
        // Filter by crime type
        const typeMatch = selectedFilter === "all" || crime.crimetype === selectedFilter

        // Filter by status
        const statusMatch = selectedStatus === "all" || crime.status === selectedStatus

        // Filter by time range
        let timeMatch = true
        if (timeRange !== "all") {
            const now = new Date()
            const crimeDate = new Date(crime.crimeDate)

            switch (timeRange) {
                case "week":
                    const weekAgo = new Date()
                    weekAgo.setDate(now.getDate() - 7)
                    timeMatch = crimeDate >= weekAgo
                    break
                case "month":
                    const monthAgo = new Date()
                    monthAgo.setMonth(now.getMonth() - 1)
                    timeMatch = crimeDate >= monthAgo
                    break
                case "year":
                    const yearAgo = new Date()
                    yearAgo.setFullYear(now.getFullYear() - 1)
                    timeMatch = crimeDate >= yearAgo
                    break
            }
        }

        return typeMatch && timeMatch && statusMatch
    })

    // Calculate crime statistics
    const crimeStats = {
        total: filteredData.length,
        byType: {
            Theft: filteredData.filter((c) => c.crimetype === "Theft").length,
            Assault: filteredData.filter((c) => c.crimetype === "Assault").length,
            Vandalism: filteredData.filter((c) => c.crimetype === "Vandalism").length,
            "Suspicious Activity": filteredData.filter((c) => c.crimetype === "Suspicious Activity").length,
            Other: filteredData.filter((c) => c.crimetype === "Other").length,
        },
        byStatus: {
            submitted: filteredData.filter((c) => c.status === "submitted").length,
            received: filteredData.filter((c) => c.status === "received").length,
            under_review: filteredData.filter((c) => c.status === "under_review").length,
            approved: filteredData.filter((c) => c.status === "approved").length,
            investigating: filteredData.filter((c) => c.status === "investigating").length,
            resolved: filteredData.filter((c) => c.status === "resolved").length,
            closed: filteredData.filter((c) => c.status === "closed").length,
            rejected: filteredData.filter((c) => c.status === "rejected").length,
        },
    }

    // Get color based on crime type
    const getCrimeColor = (type) => {
        switch (type) {
            case "Theft":
                return "#f59e0b" // amber
            case "Assault":
                return "#ef4444" // red
            case "Vandalism":
                return "#3b82f6" // blue
            case "Suspicious Activity":
                return "#8b5cf6" // purple
            default:
                return "#6b7280" // gray
        }
    }

    // Get icon based on crime type
    const getCrimeIcon = (type) => {
        switch (type) {
            case "Theft":
                return <Shield className="h-4 w-4" />
            case "Assault":
                return <AlertTriangle className="h-4 w-4" />
            case "Vandalism":
                return <Bomb className="h-4 w-4" />
            case "Suspicious Activity":
                return <Eye className="h-4 w-4" />
            default:
                return <HelpCircle className="h-4 w-4" />
        }
    }

    return (
        <div className="crime-heatmap flex h-full">
            {/* Sidebar */}
            <div
                className={`bg-white border-r border-gray-200 transition-all duration-300 ${showSidebar ? "w-80" : "w-0 overflow-hidden"}`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Crime Map</h2>
                        <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setShowSidebar(false)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    </div>

                    {/* Crime Type Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2 text-gray-700">Crime Type</h3>
                        <div className="space-y-2">
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("all")}
                            >
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                All Types
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "Theft" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("Theft")}
                            >
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                Theft
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "Assault" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("Assault")}
                            >
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                Assault
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "Vandalism" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("Vandalism")}
                            >
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Vandalism
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "Suspicious Activity" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("Suspicious Activity")}
                            >
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                Suspicious Activity
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm flex items-center gap-2 ${selectedFilter === "Other" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedFilter("Other")}
                            >
                                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                                Other
                            </button>
                        </div>
                    </div>

                    {/* Time Range Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2 text-gray-700">Time Period</h3>
                        <div className="space-y-2">
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${timeRange === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setTimeRange("all")}
                            >
                                All Time
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${timeRange === "week" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setTimeRange("week")}
                            >
                                Past Week
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${timeRange === "month" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setTimeRange("month")}
                            >
                                Past Month
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${timeRange === "year" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setTimeRange("year")}
                            >
                                Past Year
                            </button>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2 text-gray-700">Case Status</h3>
                        <div className="space-y-2">
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${selectedStatus === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedStatus("all")}
                            >
                                All Statuses
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${selectedStatus === "submitted" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedStatus("submitted")}
                            >
                                Submitted
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${selectedStatus === "investigating" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedStatus("investigating")}
                            >
                                Investigating
                            </button>
                            <button
                                className={`w-full px-3 py-2 rounded-md text-left text-sm ${selectedStatus === "resolved" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
                                onClick={() => setSelectedStatus("resolved")}
                            >
                                Resolved
                            </button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold mb-3 text-gray-700">Crime Statistics</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-500">Total Reports</div>
                                <div className="text-2xl font-bold">{crimeStats.total}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-1">By Type</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Theft</span>
                                        <span className="font-medium">{crimeStats.byType.Theft}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Assault</span>
                                        <span className="font-medium">{crimeStats.byType.Assault}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vandalism</span>
                                        <span className="font-medium">{crimeStats.byType.Vandalism}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Suspicious Activity</span>
                                        <span className="font-medium">{crimeStats.byType["Suspicious Activity"]}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Other</span>
                                        <span className="font-medium">{crimeStats.byType.Other}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-1">By Status</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Investigating</span>
                                        <span className="font-medium">{crimeStats.byStatus.investigating}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Resolved</span>
                                        <span className="font-medium">{crimeStats.byStatus.resolved}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Submitted</span>
                                        <span className="font-medium">{crimeStats.byStatus.submitted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                {!showSidebar && (
                    <button
                        className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        onClick={() => setShowSidebar(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                )}

                

                {/* Map */}
                <div style={{ height: "100%", width: "100%" }}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full bg-gray-100">
                            <p>Loading crime data...</p>
                        </div>
                    ) : (
                        <MapContainer
                            center={initialLocation}
                            zoom={mapZoom}
                            scrollWheelZoom
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Crime markers */}
                            {filteredData.map((crime) => (
                                <CircleMarker
                                    key={crime.reportId}
                                    center={[crime.location.coordinates[1], crime.location.coordinates[0]]}
                                    radius={6}
                                    fillColor={getCrimeColor(crime.crimetype)}
                                    color="#fff"
                                    weight={1}
                                    fillOpacity={0.8}
                                    eventHandlers={{
                                        mouseover: () => setHoveredCrime(crime),
                                        mouseout: () => setHoveredCrime(null),
                                    }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <div className="font-medium">{crime.crimetype}</div>
                                            <div className="text-sm text-gray-600">{crime.location.address}</div>
                                            <div className="text-sm text-gray-600">{new Date(crime.crimeDate).toLocaleDateString()}</div>
                                            <div className="text-sm mt-1">{crime.description}</div>
                                            <div className="text-sm mt-2">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-full text-xs text-white ${crime.status === "resolved"
                                                        ? "bg-green-500"
                                                        : crime.status === "investigating"
                                                            ? "bg-blue-500"
                                                            : crime.status === "approved"
                                                                ? "bg-purple-500"
                                                                : "bg-gray-500"
                                                        }`}
                                                >
                                                    {crime.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}

                            {/* Hovered crime info */}
                            {hoveredCrime && (
                                <div
                                    className="absolute p-3 bg-white rounded-lg shadow-lg z-20"
                                    style={{
                                        left: 10,
                                        bottom: 10,
                                    }}
                                >
                                    <div className="font-semibold">{hoveredCrime.crimetype}</div>
                                    <div className="text-sm text-gray-600">{hoveredCrime.location.address}</div>
                                    <div className="text-sm text-gray-600">{new Date(hoveredCrime.crimeDate).toLocaleDateString()}</div>
                                    <div className="text-sm">
                                        <span
                                            className={`inline-block px-2 py-0.5 rounded-full text-white ${hoveredCrime.status === "resolved"
                                                ? "bg-green-500"
                                                : hoveredCrime.status === "investigating"
                                                    ? "bg-blue-500"
                                                    : hoveredCrime.status === "approved"
                                                        ? "bg-purple-500"
                                                        : "bg-gray-500"
                                                }`}
                                        >
                                            {hoveredCrime.status.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </MapContainer>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CrimeHeatmap


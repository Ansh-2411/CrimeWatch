import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import {
    Shield,
    MapPin,
    Calendar,
    Clock,
    Search,
    Filter,
    Eye,
    CheckCircle,
    AlertTriangle,
    Clock3,
    X,
    FileText,
    ImageIcon,
    TimerIcon as Timeline,
    List,
    ArrowLeft,
} from "lucide-react"

const ReportStatusPage = () => {
    const { id: reportId } = useParams();
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedReport, setSelectedReport] = useState(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("list")
    const [detailTab, setDetailTab] = useState("details")
    const getUserId = () => {

        const token = localStorage.getItem('authToken');

        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            console.log(decoded.userId)
            return decoded.userId

        } catch (error) {
            console.error('Invalid token', error);
            return null;
        }
    };
    useEffect(() => {
        // Fetch reports from API
        const fetchReports = async () => {
            try {
                let response
                if (reportId) {

                    response = await fetch(`http://localhost:4000/report/${reportId}`);
                }
                else {
                    let id = getUserId()
                    response = await fetch(`http://localhost:4000/user/getReports/${id}`)
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch report");
                }
                console.log(response.data)
                const data = await response.json();
                console.log(data.data, "datatattat")

                // Mock data for demonstration
                // const mockReports = [
                //     {
                //         reportId: "REP-2025-0412",
                //         fullName: "John Doe",
                //         email: "john@example.com",
                //         crimetype: "Suspicious Activity",
                //         location: {
                //             coordinates: [-73.9654, 40.7829],
                //             address: "Central Park, East Entrance",
                //         },
                //         crimeDate: "2025-04-01T00:00:00.000Z",
                //         crimeTime: "14:30",
                //         description:
                //             "I noticed a group of individuals behaving suspiciously near the east entrance of Central Park.",
                //         crimeimageURLs: ["/placeholder1.jpg", "/placeholder2.jpg"],
                //         reportedAt: "2025-04-01T14:30:00.000Z",
                //         status: "under_review",
                //         lastUpdated: "2025-04-01T18:45:00.000Z",
                //         timeline: [
                //             { date: "2025-04-01T14:30:00.000Z", status: "submitted", note: "Report submitted" },
                //             { date: "2025-04-01T14:35:00.000Z", status: "received", note: "Report received by system" },
                //             { date: "2025-04-01T18:45:00.000Z", status: "under_review", note: "Under review by Officer Johnson" },
                //         ],
                //         assignedTo: "Officer Johnson",
                //     },
                //     {
                //         reportId: "REP-2025-0389",
                //         fullName: "Jane Smith",
                //         email: "jane@example.com",
                //         crimetype: "Theft",
                //         location: {
                //             coordinates: [-73.9876, 40.7589],
                //             address: "Downtown Mall, Parking Level B",
                //         },
                //         crimeDate: "2025-03-28T00:00:00.000Z",
                //         crimeTime: "09:15",
                //         description: "My car was broken into while parked at Downtown Mall. The passenger window was smashed.",
                //         crimeimageURLs: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
                //         reportedAt: "2025-03-28T09:15:00.000Z",
                //         status: "approved",
                //         lastUpdated: "2025-04-01T11:20:00.000Z",
                //         timeline: [
                //             { date: "2025-03-28T09:15:00.000Z", status: "submitted", note: "Report submitted" },
                //             { date: "2025-03-28T09:20:00.000Z", status: "received", note: "Report received by system" },
                //             { date: "2025-03-28T14:30:00.000Z", status: "under_review", note: "Under review by Officer Martinez" },
                //             {
                //                 date: "2025-04-01T11:20:00.000Z",
                //                 status: "approved",
                //                 note: "Report approved and case number assigned: PD-2025-1142",
                //             },
                //         ],
                //         assignedTo: "Officer Martinez",
                //     },
                //     {
                //         reportId: "REP-2025-0356",
                //         fullName: "Robert Johnson",
                //         email: "robert@example.com",
                //         crimetype: "Vandalism",
                //         location: {
                //             coordinates: [-73.9543, 40.8136],
                //             address: "Riverside Community Center",
                //         },
                //         crimeDate: "2025-03-25T00:00:00.000Z",
                //         crimeTime: "16:45",
                //         description: "The exterior wall of the community center was vandalized with graffiti overnight.",
                //         crimeimageURLs: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
                //         reportedAt: "2025-03-25T16:45:00.000Z",
                //         status: "resolved",
                //         lastUpdated: "2025-04-01T09:30:00.000Z",
                //         timeline: [
                //             { date: "2025-03-25T16:45:00.000Z", status: "submitted", note: "Report submitted" },
                //             { date: "2025-03-25T16:50:00.000Z", status: "received", note: "Report received by system" },
                //             { date: "2025-03-25T18:15:00.000Z", status: "under_review", note: "Under review by Officer Williams" },
                //             {
                //                 date: "2025-03-26T09:30:00.000Z",
                //                 status: "approved",
                //                 note: "Report approved and case number assigned: PD-2025-1098",
                //             },
                //             { date: "2025-04-01T09:30:00.000Z", status: "resolved", note: "Case resolved - Suspects identified" },
                //         ],
                //         assignedTo: "Officer Williams",
                //     },
                // ]

                const mockReports = reportId ? [data.data] : data.data

                setReports(mockReports)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching reports:", error)
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return format(date, "MMM d, yyyy h:mm a")
    }

    // Filter reports based on search query and status filter
    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            report.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.crimetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.location.address.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || report.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Status badge mapping
    const getStatusBadge = (status) => {
        const statusMap = {
            submitted: {
                label: "Submitted",
                bgColor: "bg-gray-100",
                textColor: "text-gray-700",
                icon: <Clock className="h-4 w-4 mr-1.5" />,
            },
            received: {
                label: "Received",
                bgColor: "bg-blue-100",
                textColor: "text-blue-700",
                icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
            },
            under_review: {
                label: "Under Review",
                bgColor: "bg-amber-100",
                textColor: "text-amber-700",
                icon: <Clock3 className="h-4 w-4 mr-1.5" />,
            },
            approved: {
                label: "Approved",
                bgColor: "bg-green-100",
                textColor: "text-green-700",
                icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
            },
            investigating: {
                label: "Investigating",
                bgColor: "bg-indigo-100",
                textColor: "text-indigo-700",
                icon: <Search className="h-4 w-4 mr-1.5" />,
            },
            resolved: {
                label: "Resolved",
                bgColor: "bg-green-100",
                textColor: "text-green-700",
                icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
            },
            closed: {
                label: "Closed",
                bgColor: "bg-purple-100",
                textColor: "text-purple-700",
                icon: <X className="h-4 w-4 mr-1.5" />,
            },
            rejected: {
                label: "Rejected",
                bgColor: "bg-red-100",
                textColor: "text-red-700",
                icon: <AlertTriangle className="h-4 w-4 mr-1.5" />,
            },
        }

        const defaultStatus = {
            label: "Unknown",
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
            icon: <AlertTriangle className="h-4 w-4 mr-1.5" />,
        }

        return statusMap[status] || defaultStatus
    }

    // Progress mapping
    const getStatusProgress = (status) => {
        const progressMap = {
            submitted: 10,
            received: 20,
            under_review: 40,
            approved: 60,
            investigating: 70,
            resolved: 90,
            closed: 100,
            rejected: 100,
        }

        return progressMap[status] || 0
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 max-w-7xl">
                    <div className="flex items-center justify-between">
                        <a href='/'
                            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors cursor-pointer"
                            aria-label="Back to Dashboard"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back to Dashboard</span>
                        </a>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-black" />
                                <span className="font-semibold text-lg">CrimeWatch</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Report Status</h1>
                    <p className="text-gray-600">
                        Track the status of your submitted crime reports and view updates from law enforcement.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute right-1 top-8 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by report ID, crime type, or location"
                                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="submitted">Submitted</option>
                                        <option value="received">Received</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="investigating">Investigating</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <Filter className="absolute top-4 inset-y-0 right-0 flex items-center mr-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex border-b">
                                <button
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "list" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setActiveTab("list")}
                                >
                                    <div className="flex items-center gap-2">
                                        <List className="h-4 w-4" />
                                        <span>List View</span>
                                    </div>
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === "timeline"
                                        ? "text-black border-b-2 border-black"
                                        : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setActiveTab("timeline")}
                                >
                                    <div className="flex items-center gap-2">
                                        <Timeline className="h-4 w-4" />
                                        <span>Timeline View</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
                            </div>
                        ) : (
                            <>
                                {activeTab === "list" && (
                                    <div className="space-y-4">
                                        {filteredReports.length > 0 ? (
                                            filteredReports.map((report) => {
                                                const statusInfo = getStatusBadge(report.status)
                                                const progressValue = getStatusProgress(report.status)

                                                return (
                                                    <div
                                                        key={report.reportId}
                                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex flex-col md:flex-row">
                                                            <div className="flex-1 p-5">
                                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                                                                        <h3 className="font-semibold text-lg">{report.reportId}</h3>
                                                                        <span
                                                                            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                                                                        >
                                                                            {statusInfo.icon}
                                                                            {statusInfo.label}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">Reported: {formatDate(report.reportedAt)}</div>
                                                                </div>

                                                                <h2 className="text-xl font-bold mb-3">{report.crimetype}</h2>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                                    <div className="flex items-center gap-2 text-gray-600">
                                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                                        <span>{formatDate(report.crimeDate).split(",")[0]}</span>
                                                                        <Clock className="h-4 w-4 ml-2 text-gray-500" />
                                                                        <span>{report.crimeTime}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-gray-600">
                                                                        <MapPin className="h-4 w-4 text-gray-500" />
                                                                        <span>{report.location.address}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-4">
                                                                    <div className="flex justify-between text-sm mb-1">
                                                                        <span className="font-medium">Progress</span>
                                                                        <span className="text-gray-500">{progressValue}%</span>
                                                                    </div>
                                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full ${report.status === "rejected"
                                                                                ? "bg-red-500"
                                                                                : report.status === "resolved" || report.status === "closed"
                                                                                    ? "bg-green-500"
                                                                                    : "bg-black"
                                                                                }`}
                                                                            style={{ width: `${progressValue}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {report.crimeimageURLs.length > 0 && (
                                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center gap-1">
                                                                                <ImageIcon className="h-3.5 w-3.5" />
                                                                                {report.crimeimageURLs.length} Files
                                                                            </span>
                                                                        )}
                                                                        {report.timeline.some((item) => item.note.includes("case number assigned")) && (
                                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm">
                                                                                Case #
                                                                                {
                                                                                    report.timeline
                                                                                        .find((item) => item.note.includes("case number assigned"))
                                                                                        .note.split(": ")[1]
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        className="px-3 py-2 bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition-colors"
                                                                        onClick={() => {
                                                                            setSelectedReport(report)
                                                                            setDetailsOpen(true)
                                                                        }}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {report.status === "approved" && (
                                                                <div className="w-full md:w-32 bg-green-50 flex items-center justify-center p-4 border-t md:border-t-0 md:border-l border-green-100">
                                                                    <div className="text-center">
                                                                        <div className="rounded-full bg-green-100 p-2 mx-auto mb-2">
                                                                            <MapPin className="h-5 w-5 text-green-600" />
                                                                        </div>
                                                                        <p className="text-sm font-medium text-green-800">Visible on Map</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="text-center py-16 bg-gray-50 rounded-xl">
                                                <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4 w-fit">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">No reports found</h3>
                                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "timeline" && (
                                    <div className="space-y-6">
                                        {filteredReports.length > 0 ? (
                                            filteredReports.map((report) => {
                                                const statusInfo = getStatusBadge(report.status)

                                                return (
                                                    <div
                                                        key={report.reportId}
                                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                                                    >
                                                        <div className="bg-gray-50 p-5 border-b border-gray-200">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                                <div>
                                                                    <h3 className="font-bold text-xl">{report.crimetype}</h3>
                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                                                                        <span className="font-medium">{report.reportId}</span>
                                                                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                                                                        <div className="flex items-center">
                                                                            <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1" />
                                                                            <span>{report.location.address}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium mt-2 md:mt-0 w-fit ${statusInfo.bgColor} ${statusInfo.textColor}`}
                                                                >
                                                                    {statusInfo.icon}
                                                                    {statusInfo.label}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="p-5">
                                                            <div className="relative">
                                                                {report.timeline.map((event, index) => {
                                                                    const eventStatus = getStatusBadge(event.status)
                                                                    const isLast = index === report.timeline.length - 1

                                                                    return (
                                                                        <div key={index} className="mb-6 last:mb-0">
                                                                            <div className="flex">
                                                                                <div className="relative mr-4">
                                                                                    <div
                                                                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${eventStatus.bgColor}`}
                                                                                    >
                                                                                        {eventStatus.icon}
                                                                                    </div>
                                                                                    {!isLast && (
                                                                                        <div className="absolute top-10 bottom-0 left-1/2 w-0.5 -ml-px bg-gray-200 h-full"></div>
                                                                                    )}
                                                                                </div>

                                                                                <div
                                                                                    className={`flex-1 p-4 rounded-lg border ${index === report.timeline.length - 1 ? "border-black bg-gray-50" : "border-gray-200"}`}
                                                                                >
                                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                                                                        <h4 className="font-semibold text-lg">{eventStatus.label}</h4>
                                                                                        <time className="text-sm text-gray-500">{formatDate(event.date)}</time>
                                                                                    </div>
                                                                                    <p className="text-gray-700">{event.note}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>

                                                            <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                                                                <button
                                                                    className="px-4 py-2.5 bg-black text-white rounded-lg text-sm flex items-center hover:bg-gray-800 transition-colors"
                                                                    onClick={() => {
                                                                        setSelectedReport(report)
                                                                        setDetailsOpen(true)
                                                                    }}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Full Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div className="text-center py-16 bg-gray-50 rounded-xl">
                                                <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4 w-fit">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">No reports found</h3>
                                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Report Details Modal */}
            {detailsOpen && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Report {selectedReport.reportId}</h2>
                            <button
                                onClick={() => setDetailsOpen(false)}
                                className="text-gray-500 hover:text-black transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="border-b border-gray-200">
                            <div className="flex">
                                <button
                                    className={`px-5 py-3 font-medium transition-colors ${detailTab === "details" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setDetailTab("details")}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>Details</span>
                                    </div>
                                </button>
                                <button
                                    className={`px-5 py-3 font-medium transition-colors ${detailTab === "timeline"
                                        ? "text-black border-b-2 border-black"
                                        : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setDetailTab("timeline")}
                                >
                                    <div className="flex items-center gap-2">
                                        <Timeline className="h-4 w-4" />
                                        <span>Timeline</span>
                                    </div>
                                </button>
                                <button
                                    className={`px-5 py-3 font-medium transition-colors ${detailTab === "media" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    onClick={() => setDetailTab("media")}
                                >
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        <span>Media</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {detailTab === "details" && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Crime Type</h3>
                                        <p className="text-lg">{selectedReport.crimetype}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Location</h3>
                                        <p className="text-lg">{selectedReport.location.address}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Coordinates: {selectedReport.location.coordinates.join(", ")}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Date & Time</h3>
                                        <p className="text-lg">
                                            {formatDate(selectedReport.crimeDate)} at {selectedReport.crimeTime}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Description</h3>
                                        <p className="text-lg">{selectedReport.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Status</h3>
                                        <span
                                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(selectedReport.status).bgColor
                                                } ${getStatusBadge(selectedReport.status).textColor}`}
                                        >
                                            {getStatusBadge(selectedReport.status).icon}
                                            {getStatusBadge(selectedReport.status).label}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-500 mb-1">Assigned To</h3>
                                        <p className="text-lg">{selectedReport.assignedTo}</p>
                                    </div>
                                </div>
                            )}

                            {detailTab === "timeline" && (
                                <div className="space-y-5">
                                    {selectedReport.timeline.map((event, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                {getStatusBadge(event.status).icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{event.note}</p>
                                                <p className="text-sm text-gray-500 mt-1">{formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {detailTab === "media" && (
                                <div className="space-y-4">
                                    {selectedReport.crimeimageURLs.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedReport.crimeimageURLs.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url || "/placeholder.svg"}
                                                        alt={`Crime evidence ${index + 1}`}
                                                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all rounded-lg">
                                                        <button className="bg-white text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl">
                                            <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4 w-fit">
                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500">No media files attached to this report.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportStatusPage


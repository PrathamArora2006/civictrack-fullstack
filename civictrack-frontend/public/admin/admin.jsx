import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8080"; // Replace with your deployed backend URL in production

// In-depth mock data for a robust fallback
const mockIssues = [
    { id: 1, category: 'Potholes', description: 'Major pothole causing issues on the main road. It is deep and has damaged multiple car tires.', upvotes: 25, createdAt: '2025-09-12T10:00:00Z', status: 'active', adminPriorityScore: 85, satisfiedWithWork: null, assignedEmployeeName: null, address: 'Main Road, near City Bank, Chennai', imageUrl: 'https://placehold.co/600x400/F1F8E8/000000?text=Pothole', latitude: 13.0827, longitude: 80.2707 },
    { id: 2, category: 'Garbage', description: 'Garbage bin overflowing near the central park entrance. Waste has been piling up for over a week.', upvotes: 10, createdAt: '2025-09-11T14:00:00Z', status: 'In Progress', adminPriorityScore: 78, satisfiedWithWork: null, assignedEmployeeName: 'Ravi Kumar', address: 'Central Park, Gate 3, Chennai', imageUrl: 'https://placehold.co/600x400/F1F8E8/000000?text=Garbage', latitude: 13.0827, longitude: 80.2707 },
    { id: 3, category: 'Streetlights', description: 'Streetlight is out on 2nd Avenue, making it unsafe at night.', upvotes: 4, createdAt: '2025-09-10T08:00:00Z', status: 'Resolved', adminPriorityScore: 60, satisfiedWithWork: true, satisfiedWithSpeed: false, assignedEmployeeName: 'Sita Devi', address: '2nd Avenue, Anna Nagar, Chennai', imageUrl: 'https://placehold.co/600x400/F1F8E8/000000?text=Streetlight', resolvedImageUrl: 'https://placehold.co/600x400/95D2B3/white?text=Fixed' },
];

export default function App() {
    const [activePage, setActivePage] = useState("dashboard");
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/complaints/admin-view`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setIssues(data);
            setFetchError(null);
        } catch (err) {
            console.error("Failed to fetch issues:", err);
            setFetchError("Could not connect to the backend. Please ensure the Java server is running. Displaying mock data.");
            setIssues(mockIssues);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const resolvedCount = issues.filter(i => i.status === "Resolved").length;
    const progress = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0;
    const pendingCount = issues.filter(i => i.status === "active").length;
    const inProgressCount = issues.filter(i => i.status === "In Progress").length;

    return (
        <div className="flex min-h-screen bg-[#F1F8E8] font-sans">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-8 space-y-6">
                {fetchError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
                        <p className="font-bold">Connection Error</p>
                        <p>{fetchError}</p>
                    </div>
                )}
                {activePage === "dashboard" && <DashboardStats issues={issues} pending={pendingCount} inProgress={inProgressCount} resolved={resolvedCount} progress={progress} />}
                {activePage === "issues" && <IssuesTable issues={issues.filter(i => i.status !== 'Resolved')} onSelectIssue={setSelectedIssue} />}
                {activePage === "resolved" && <ResolvedTable issues={issues.filter(i => i.status === 'Resolved')} onSelectIssue={setSelectedIssue} />}
                {activePage === "feedback" && <FeedbackTable issues={issues.filter(i => i.status === 'Resolved' && i.satisfiedWithWork !== null)} />}
            </main>
            {selectedIssue && <IssueDetailsModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} onUpdate={fetchIssues} isLive={!fetchError} />}
        </div>
    );
}

// --- Components ---
const Sidebar = ({ activePage, setActivePage }) => (
    <aside className="w-64 bg-[#55AD9B] text-white p-6 space-y-4 shadow-lg flex-shrink-0">
        <h2 className="text-2xl font-bold text-center">CivicTrack Admin</h2>
        <nav className="space-y-2 pt-4">
            {["dashboard", "issues", "resolved", "feedback"].map((page) => (
                <button key={page}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${activePage === page ? "bg-[#D8EFD3] text-[#55AD9B] font-bold" : "hover:bg-white/20"}`}
                    onClick={() => setActivePage(page)}>
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
            ))}
        </nav>
    </aside>
);

const DashboardStats = ({ issues, pending, inProgress, resolved, progress }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow text-center"><h3 className="text-gray-500">Total Issues</h3><p className="text-3xl font-bold text-[#55AD9B] mt-2">{issues.length}</p></div>
            <div className="bg-white p-6 rounded-xl shadow text-center"><h3 className="text-gray-500">Pending</h3><p className="text-3xl font-bold text-yellow-500 mt-2">{pending}</p></div>
            <div className="bg-white p-6 rounded-xl shadow text-center"><h3 className="text-gray-500">In Progress</h3><p className="text-3xl font-bold text-blue-500 mt-2">{inProgress}</p></div>
            <div className="bg-white p-6 rounded-xl shadow text-center"><h3 className="text-gray-500">Resolved</h3><p className="text-3xl font-bold text-green-500 mt-2">{resolved}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Resolution Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-5"><div className="bg-[#95D2B3] h-5 rounded-full text-center text-white" style={{ width: `${progress}%` }}>{progress > 10 ? `${progress}%` : ''}</div></div>
        </div>
    </>
);

const IssuesTable = ({ issues, onSelectIssue }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="font-bold text-xl mb-4">Active Issues (Sorted by Priority)</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-[#D8EFD3] uppercase"><tr><th className="p-3">Priority</th><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3">Upvotes</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                    {issues.map(issue => (
                        <tr key={issue.id} className="border-b">
                            <td className="p-3 text-center font-bold">{Math.round(issue.adminPriorityScore)}</td>
                            <td className="p-3">{issue.category}</td>
                            <td className="p-3 max-w-sm truncate">{issue.description}</td>
                            <td className="p-3 text-center">{issue.upvotes}</td>
                            <td className="p-3 font-medium">{issue.status}</td>
                            <td className="p-3"><button onClick={() => onSelectIssue(issue)} className="text-[#55AD9B] hover:underline">Manage</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ResolvedTable = ({ issues, onSelectIssue }) => (
     <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="font-bold text-xl mb-4">Resolved Issues</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-[#D8EFD3] uppercase"><tr><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3">Assigned To</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                    {issues.map(issue => (
                        <tr key={issue.id} className="border-b">
                            <td className="p-3">{issue.category}</td>
                            <td className="p-3 max-w-sm truncate">{issue.description}</td>
                            <td className="p-3">{issue.assignedEmployeeName || 'N/A'}</td>
                            <td className="p-3"><button onClick={() => onSelectIssue(issue)} className="text-[#55AD9B] hover:underline">View Details</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const FeedbackTable = ({ issues }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="font-bold text-xl mb-4">Citizen Feedback</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-[#D8EFD3] uppercase"><tr><th className="p-3">Complaint</th><th className="p-3">Assigned To</th><th className="p-3">Work Quality</th><th className="p-3">Speed</th></tr></thead>
                <tbody>
                    {issues.map(issue => (
                        <tr key={issue.id} className="border-b">
                            <td className="p-3 max-w-sm truncate">{issue.description}</td>
                            <td className="p-3">{issue.assignedEmployeeName || 'N/A'}</td>
                            <td className="p-3">{issue.satisfiedWithWork ? '✅ Good' : '❌ Poor'}</td>
                            <td className="p-3">{issue.satisfiedWithSpeed ? '✅ Good' : '❌ Poor'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const IssueDetailsModal = ({ issue, onClose, onUpdate, isLive }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeContact, setEmployeeContact] = useState('');
    const [resolutionImage, setResolutionImage] = useState(null);

    const handleAction = async (endpoint, method, body) => {
        if (!isLive) {
            alert("Actions are disabled when using mock data.");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/complaints${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null,
            });
            if (!response.ok) throw new Error("Action failed");
            onUpdate();
            onClose();
        } catch (err) {
            console.error(`Failed to ${endpoint}:`, err);
            alert("An error occurred. Please try again.");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResolutionImage(reader.result); // base64 string
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                <h3 className="text-xl font-bold mb-1">{issue.category}</h3>
                <p className="text-sm text-gray-500 mb-4">{issue.address}</p>
                <p className="mb-4 text-gray-700">{issue.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div><strong>Status:</strong> {issue.status}</div>
                    <div><strong>Upvotes:</strong> {issue.upvotes}</div>
                    <div><strong>Assigned To:</strong> {issue.assignedEmployeeName || 'N/A'}</div>
                    <div><strong>Contact:</strong> {issue.assignedEmployeeContact || 'N/A'}</div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="w-1/2 text-center"><p className="font-semibold mb-1">Before</p><img src={issue.imageUrl} alt="Complaint" className="rounded-lg w-full h-40 object-cover"/></div>
                    <div className="w-1/2 text-center"><p className="font-semibold mb-1">After</p>{issue.resolvedImageUrl ? <img src={issue.resolvedImageUrl} alt="Resolution" className="rounded-lg w-full h-40 object-cover"/> : <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Not Resolved</div>}</div>
                </div>
                
                <div className="border-t pt-4">
                    <h4 className="font-bold text-lg mb-2">Manage Issue</h4>
                    {issue.status === 'active' && (
                        <form onSubmit={(e) => { e.preventDefault(); handleAction(`/${issue.id}/assign`, 'PUT', { name: employeeName, contact: employeeContact }); }} className="space-y-2">
                            <p className="text-sm font-semibold">Assign Employee:</p>
                            <input type="text" placeholder="Employee Name" value={employeeName} onChange={e => setEmployeeName(e.target.value)} className="w-full p-2 border rounded" required />
                            <input type="text" placeholder="Employee Contact" value={employeeContact} onChange={e => setEmployeeContact(e.target.value)} className="w-full p-2 border rounded" required />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm w-full">Assign & Set In Progress</button>
                        </form>
                    )}
                    {issue.status === 'In Progress' && (
                        <form onSubmit={(e) => { e.preventDefault(); handleAction(`/${issue.id}/resolve`, 'PUT', { resolvedImageUrl: resolutionImage }); }} className="space-y-2">
                            <p className="text-sm font-semibold">Resolve Issue:</p>
                            <label className="block text-sm">Upload Proof of Work:</label>
                            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded text-sm" accept="image/*" required />
                            {resolutionImage && <img src={resolutionImage} alt="Preview" className="h-20 rounded mt-2"/>}
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm w-full">Confirm & Resolve Issue</button>
                        </form>
                    )}
                     {issue.status === 'Resolved' && (
                        <button onClick={() => handleAction(`/${issue.id}/status`, 'PUT', { status: 'In Progress' })} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm w-full">Reopen Issue</button>
                    )}
                </div>
            </div>
        </div>
    );
};


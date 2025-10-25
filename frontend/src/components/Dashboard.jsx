import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react' // <-- Added Auth0
import { Plus, AlertTriangle, CheckCircle, Clock, Calendar, Package, TrendingUp, History, Filter } from 'lucide-react'
// --> Added addMonths for markComplete, and robust date parsing
import { format, addDays, isAfter, isBefore, subDays, isSameDay, addMonths } from 'date-fns'

// --> API base URL is set to your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api' 

export default function Dashboard() {
    // --> Assets now starts empty
    const [assets, setAssets] = useState([])
    const [upcomingTasks, setUpcomingTasks] = useState([])
    const [overdueTasks, setOverdueTasks] = useState([])
    const [recentCompletions, setRecentCompletions] = useState([])
    const [selectedTimeframe, setSelectedTimeframe] = useState('week')

    // --> New states for loading and errors
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // --> This now uses the REAL useAuth0 hook from the library
    const { 
        user, 
        isAuthenticated, 
        isLoading: authIsLoading, 
        getAccessTokenSilently 
    } = useAuth0() 

    // --> This new useEffect hook fetches assets from your backend
    useEffect(() => {
        if (isAuthenticated && !authIsLoading) {
            const fetchAssets = async () => {
                try {
                    setIsLoading(true)
                    setError(null)
                    
                    const token = await getAccessTokenSilently()

                    const response = await fetch(`${API_BASE_URL}/assets`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                    if (!response.ok) {
                        let errorMsg = 'Failed to fetch dashboard data.'
                        if (response.status === 401) {
                            errorMsg = "Authentication failed. Check API audience settings."
                        }
                        throw new Error(errorMsg)
                    }

                    const data = await response.json()
                    setAssets(data)

                } catch (e) {
                    console.error("Error fetching assets:", e)
                    setError(e.message)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchAssets()
        } else if (!authIsLoading) {
            setIsLoading(false)
        }
    }, [isAuthenticated, authIsLoading, getAccessTokenSilently])

    // --> This useEffect calculates stats AFTER assets are fetched
    useEffect(() => {
        // Guard against running calculations on empty/mock data
        if (assets.length === 0) {
            setUpcomingTasks([])
            setOverdueTasks([])
            setRecentCompletions([])
            return;
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0); // Normalize date
        
        const next7Days = addDays(today, 7)
        const next30Days = addDays(today, 30)
        
        // Calculate upcoming tasks
        const upcoming = assets
            .map(asset => ({
                ...asset,
                // --> Robust date parsing for 'yyyy-MM-dd'
                nextDate: new Date(asset.nextMaintenance.replace(/-/g, '\/')), 
                daysUntil: Math.ceil((new Date(asset.nextMaintenance.replace(/-/g, '\/')) - today) / (1000 * 60 * 60 * 24))
            }))
            .filter(asset => 
                !isSameDay(asset.nextDate, today) && // Exclude today
                isAfter(asset.nextDate, today) && 
                isBefore(asset.nextDate, selectedTimeframe === 'week' ? next7Days : next30Days)
            )
            .sort((a, b) => a.nextDate - b.nextDate)
        
        setUpcomingTasks(upcoming)

        // Calculate overdue tasks (and tasks due today)
        const overdue = assets
            .map(asset => ({
                ...asset,
                nextDate: new Date(asset.nextMaintenance.replace(/-/g, '\/')),
                daysOverdue: Math.ceil((today - new Date(asset.nextMaintenance.replace(/-/g, '\/'))) / (1000 * 60 * 60 * 24))
            }))
             // --> Updated filter to include tasks due today
            .filter(asset => isBefore(asset.nextDate, today) || isSameDay(asset.nextDate, today))
            .sort((a, b) => b.daysOverdue - a.daysOverdue)
        
        setOverdueTasks(overdue)

        // Get recent completions
        // --> This part assumes your backend API returns `maintenanceHistory`.
        // If not, this list will be empty, which is safe.
        const allCompletions = assets
            .flatMap(asset => 
                // --> Makes this safe if maintenanceHistory is null/undefined
                (asset.maintenanceHistory || []) 
                    .filter(history => history.completed)
                    .map(history => ({
                        ...history,
                        assetName: asset.name,
                        assetCategory: asset.category,
                        date: new Date(history.date.replace(/-/g, '\/'))
                    }))
            )
            .sort((a, b) => b.date - a.date)
            .slice(0, 10)
        
        setRecentCompletions(allCompletions)
    }, [assets, selectedTimeframe])

    // --> Helper function to make API calls
    const getAuthRequest = async (method, endpoint, body = null) => {
        try {
            const token = await getAccessTokenSilently()
            const options = {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            if (body) {
                options.body = JSON.stringify(body)
            }
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, options)
            
            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`API Error (${response.status}): ${errorData || 'Request failed'}`)
            }

            if (response.status === 204) return null
            return await response.json()

        } catch (e) {
            console.error(`Error with ${method} ${endpoint}:`, e)
            setError(e.message)
            throw e 
        }
    }

    // --> markComplete function, copied from Assets.jsx
    const markComplete = async (id) => {
        const asset = assets.find(a => a.id === id)
        if (!asset) return

        const newLastMaintenance = format(new Date(), 'yyyy-MM-dd')
        const newNextMaintenance = format(addMonths(new Date(), asset.interval), 'yyyy-MM-dd')

        const updateData = {
            lastMaintenance: newLastMaintenance,
            nextMaintenance: newNextMaintenance
        }

        try {
            setError(null) // Clear old errors
            const updatedAsset = await getAuthRequest(
                'PATCH', 
                `assets/${id}`, 
                updateData
            )
            
            // Update state with the returned asset
            // This will automatically trigger the calculation useEffect
            setAssets(assets.map(a => 
                a.id === updatedAsset.id ? updatedAsset : a
            ))

        } catch (e) {
            console.error("Failed to mark complete:", e)
            // Error is set by getAuthRequest
        }
    }

    // --- Helper functions for styling (unchanged) ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'overdue': return 'status-overdue'
            case 'current': return 'status-current'
            case 'upcoming': return 'status-upcoming'
            default: return 'status-upcoming'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'overdue': return <AlertTriangle size={16} />
            case 'current': return <Clock size={16} />
            case 'upcoming': return <CheckCircle size={16} />
            default: return <CheckCircle size={16} />
        }
    }

    const getPriorityLevel = (daysUntil) => {
        if (daysUntil <= 3) return 'high'
        if (daysUntil <= 7) return 'medium'
        return 'low'
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high'
            case 'medium': return 'priority-medium'
            case 'low': return 'priority-low'
            default: return 'priority-low'
        }
    }
    // --- End Helper Functions ---

    // --> Handle Auth0 loading state
    if (authIsLoading) {
        return <div className="loading-fullscreen">Authenticating...</div>
    }

    // --> Handle non-authenticated state
    if (!isAuthenticated) {
        return <div className="loading-fullscreen">Please log in to view your dashboard.</div>
    }

    // --> Handle API loading state
    if (isLoading) {
        return <div className="loading-fullscreen">Loading dashboard data...</div>
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>{user?.given_name || 'Your'}'s Maintenance Dashboard</h1>
                <p>Track your home and asset maintenance schedules</p>
            </div>

            {/* --> Global Error Banner */}
            {error && (
                <div className="error-banner">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Key Metrics (now uses live data) */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Package size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{assets.length}</h3>
                        <p>Total Assets</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon overdue">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{overdueTasks.length}</h3>
                        <p>Overdue Tasks</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon current">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{upcomingTasks.length}</h3>
                        <p>Upcoming ({selectedTimeframe === 'week' ? '7' : '30'} days)</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon upcoming">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{recentCompletions.length}</h3>
                        <p>Recent Completions</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Overdue Tasks Section (now functional) */}
                {overdueTasks.length > 0 && (
                    <div className="dashboard-section urgent">
                        <div className="section-header">
                            <div className="section-title">
                                <AlertTriangle size={20} className="urgent-icon" />
                                <h2>Urgent: Overdue & Due Today</h2>
                            </div>
                            <span className="urgent-count">{overdueTasks.length} items</span>
                        </div>
                        
                        <div className="tasks-list">
                            {overdueTasks.map(task => (
                                <div key={task.id} className="task-card urgent">
                                    <div className="task-header">
                                        <div className="task-info">
                                            <h3>{task.name}</h3>
                                            <span className="task-category">{task.category}</span>
                                        </div>
                                        <div className="task-status">
                                            <span className="overdue-badge">
                                                {/* --> Updated logic for "Due Today" */}
                                                {task.daysOverdue === 0 ? 'Due Today' : `${task.daysOverdue} days overdue`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="task-details">
                                        <p className="task-description">{task.description}</p>
                                        <div className="task-meta">
                                            <span>Due: {format(task.nextDate, 'MMM dd, yyyy')}</span>
                                            <span>Interval: Every {task.interval} months</span>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        {/* --> Button is now wired up <-- */}
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => markComplete(task.id)}
                                        >
                                            Mark Complete
                                        </button>
                                        <button className="btn btn-outline">Reschedule</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Tasks Section (now functional) */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <div className="section-title">
                            <Calendar size={20} />
                            <h2>Upcoming Tasks</h2>
                        </div>
                        <div className="timeframe-filter">
                            <button 
                                className={`filter-btn ${selectedTimeframe === 'week' ? 'active' : ''}`}
                                onClick={() => setSelectedTimeframe('week')}
                            >
                                Next 7 Days
                            </button>
                            <button 
                                className={`filter-btn ${selectedTimeframe === 'month' ? 'active' : ''}`}
                                onClick={() => setSelectedTimeframe('month')}
                            >
                                Next 30 Days
                            </button>
                        </div>
                    </div>
                    
                    {upcomingTasks.length > 0 ? (
                        <div className="tasks-list">
                            {upcomingTasks.map(task => {
                                const priority = getPriorityLevel(task.daysUntil)
                                return (
                                    <div key={task.id} className={`task-card ${getPriorityColor(priority)}`}>
                                        <div className="task-header">
                                            <div className="task-info">
                                                <h3>{task.name}</h3>
                                                <span className="task-category">{task.category}</span>
                                            </div>
                                            <div className="task-status">
                                                <span className={`priority-badge ${getPriorityColor(priority)}`}>
                                                    {/* --> Simplified logic, "Due Today" is in the overdue section */}
                                                    {task.daysUntil === 1 ? 'Due Tomorrow' : 
                                                     `Due in ${task.daysUntil} days`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="task-details">
                                            <p className="task-description">{task.description}</p>
                                            <div className="task-meta">
                                                <span>Due: {format(task.nextDate, 'MMM dd, yyyy')}</span>
                                                <span>Interval: Every {task.interval} months</span>
                                            </div>
                                        </div>
                                        <div className="task-actions">
                                            {/* --> Button is now wired up <-- */}
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => markComplete(task.id)}
                                            >
                                                Mark Complete
                                            </button>
                                            <button className="btn btn-outline">View Details</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No upcoming tasks</h3>
                            <p>Great job! No maintenance tasks due in the next {selectedTimeframe === 'week' ? '7' : '30'} days.</p>
                        </div>
                    )}
                </div>

                {/* Recent Completions Timeline */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <div className="section-title">
                            <History size={20} />
                            <h2>Recent Maintenance History</h2>
                        </div>
                        {/* --> This <Link> tag is from react-router-dom */}
                        <Link to="/calendar" className="btn btn-outline">
                            View Full History
                        </Link>
                    </div>
                    
                    {recentCompletions.length > 0 ? (
                        <div className="timeline">
                            {recentCompletions.map((completion, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <h4>{completion.task}</h4>
                                            <span className="timeline-date">
                                                {format(completion.date, 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="timeline-details">
                                            <span className="timeline-asset">{completion.assetName}</span>
                                            <span className="timeline-category">{completion.assetCategory}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <History size={48} />
                            <h3>No recent completions</h3>
                            <p>Complete some maintenance tasks to see them here.</p>
                            <small>(Note: This requires `maintenanceHistory` data from the API)</small>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        {/* --> These <Link> tags are from react-router-dom */}
                        <Link to="/assets" className="quick-action-card">
                            <Plus size={32} />
                            <h3>Add New Asset</h3>
                            <p>Track maintenance for a new item</p>
                        </Link>
                        
                        <Link to="/assets" className="quick-action-card">
                            <Package size={32} />
                            <h3>Manage Assets</h3>
                            <p>Edit or organize your assets</p>
                        </Link>
                        
                        <Link to="/calendar" className="quick-action-card">
                            <Calendar size={32} />
                            <h3>View Calendar</h3>
                            <p>See all maintenance schedules</p>
                        </Link>
                        
                        <Link to="/assets" className="quick-action-card">
                            <CheckCircle size={32} />
                            <h3>Log Maintenance</h3>
                            <p>Go to assets to mark as completed</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { useState, useEffect } from 'react'
// --> This is now uncommented and will use the real Auth0 library
import { useAuth0 } from '@auth0/auth0-react'
import { Plus, Edit, Trash2, Calendar, Package, AlertTriangle } from 'lucide-react'
import { format, addMonths } from 'date-fns'

// --> API base URL is set to your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api' 

// -----------------------------------------------------------------------------
// --> MOCK useAuth0 HOOK HAS BEEN REMOVED
// -----------------------------------------------------------------------------


export default function Assets() {
    // --> assets state now starts empty and will be filled from the API
    const [assets, setAssets] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingAsset, setEditingAsset] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        interval: 3,
        lastMaintenance: format(new Date(), 'yyyy-MM-dd')
    })
    
    // --> State for loading, errors, and the delete confirmation
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showConfirmDelete, setShowConfirmDelete] = useState(null) // Will store the ID of asset to delete

    const categories = ['HVAC', 'Safety', 'Vehicle', 'Appliances', 'Plumbing', 'Electrical', 'Other']

    // --> This now uses the REAL useAuth0 hook from the library
    const { 
        user, 
        isAuthenticated, 
        isLoading: authIsLoading, 
        getAccessTokenSilently 
    } = useAuth0() 

    // --> This useEffect hook fetches assets from your backend
    useEffect(() => {
        // Only fetch if the user is authenticated
        if (isAuthenticated && !authIsLoading) { // Added check for authIsLoading
            const fetchAssets = async () => {
                try {
                    setIsLoading(true)
                    setError(null)
                    
                    // Get the REAL JWT token from Auth0
                    const token = await getAccessTokenSilently()

                    // Make an authenticated request to your backend
                    const response = await fetch(`${API_BASE_URL}/assets`, {
                        headers: {
                            // Send the token to authorize the request
                            Authorization: `Bearer ${token}`
                        }
                    })

                    if (!response.ok) {
                        // Try to parse error message from backend
                        let errorMsg = 'Failed to fetch assets. Please try again.'
                        if (response.status === 401) {
                            errorMsg = "Authentication failed. Check API audience settings in Auth0 and Spring Boot."
                        } else {
                             try {
                                const errData = await response.json();
                                errorMsg = errData.message || errData.error || errorMsg;
                            } catch(e) { /* ignore json parse error */ }
                        }
                        throw new Error(errorMsg)
                    }

                    const data = await response.json()
                    // --> Your backend should return an array of assets for this user
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
            // Not authenticated, set loading false and clear assets
            setIsLoading(false)
            setAssets([])
        }
    }, [isAuthenticated, authIsLoading, getAccessTokenSilently]) // --> Re-run if auth state changes

    // --> Helper function to get the token for API calls
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

            // Handle no-content responses (like DELETE)
            if (response.status === 204) {
                return null
            }

            return await response.json()

        } catch (e) {
            console.error(`Error with ${method} ${endpoint}:`, e)
            setError(e.message)
            throw e // Re-throw to stop form processing
        }
    }

    // --> handleSubmit is now async and calls your API
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const assetData = {
            ...formData,
            // Calculate next maintenance date
            nextMaintenance: format(addMonths(new Date(formData.lastMaintenance), formData.interval), 'yyyy-MM-dd')
        }

        try {
            if (editingAsset) {
                // Update existing asset (PUT request)
                const updatedAsset = await getAuthRequest(
                    'PUT', 
                    `assets/${editingAsset.id}`, 
                    assetData
                )
                
                // Update state with the returned asset from the API
                setAssets(assets.map(asset => 
                    asset.id === updatedAsset.id ? updatedAsset : asset
                ))
                setEditingAsset(null)

            } else {
                // Add new asset (POST request)
                // We assume the backend will assign the id, user, and status
                const newAsset = await getAuthRequest(
                    'POST', 
                    'assets', 
                    assetData
                )

                // Add the new asset returned from the API to the state
                setAssets([...assets, newAsset])
            }
            
            // Reset form and close modal on success
            setFormData({
                name: '', category: '', description: '', interval: 3,
                lastMaintenance: format(new Date(), 'yyyy-MM-dd')
            })
            setShowAddForm(false)
            setError(null)

        } catch (e) {
            // Error is already set by getAuthRequest
            console.error("Failed to submit asset:", e)
        }
    }

    // --> handleEdit stays the same, it just prepares the form
    const handleEdit = (asset) => {
        setEditingAsset(asset)
        setFormData({
            name: asset.name,
            category: asset.category,
            description: asset.description,
            interval: asset.interval,
            lastMaintenance: asset.lastMaintenance // Assumes 'yyyy-MM-dd'
        })
        setShowAddForm(true)
    }

    // --> This function just opens the confirmation modal
    const handleDelete = (id) => {
        setShowConfirmDelete(id)
    }

    // --> This function runs the actual delete logic
    const confirmDelete = async () => {
        if (!showConfirmDelete) return
        
        try {
            // Send DELETE request
            await getAuthRequest('DELETE', `assets/${showConfirmDelete}`)
            
            // Update state locally
            setAssets(assets.filter(asset => asset.id !== showConfirmDelete))
            setShowConfirmDelete(null) // Close modal
            setError(null)

        } catch (e) {
            console.error("Failed to delete asset:", e)
            // Error is set by getAuthRequest
        }
    }

    // --> markComplete is now async and calls your API (e.g., a PATCH request)
    const markComplete = async (id) => {
        const asset = assets.find(a => a.id === id)
        if (!asset) return

        const newLastMaintenance = format(new Date(), 'yyyy-MM-dd')
        const newNextMaintenance = format(addMonths(new Date(), asset.interval), 'yyyy-MM-dd')

        // --> This assumes your API can take partial updates (PATCH)
        // You might need to send a full object (PUT)
        const updateData = {
            lastMaintenance: newLastMaintenance,
            nextMaintenance: newNextMaintenance,
            status: 'upcoming' // Your backend might calculate this
        }

        try {
            const updatedAsset = await getAuthRequest(
                'PATCH', 
                `assets/${id}`, 
                updateData
            )
            
            // Update state with the returned asset
            setAssets(assets.map(a => 
                a.id === updatedAsset.id ? updatedAsset : a
            ))
            setError(null)

        } catch (e) {
            console.error("Failed to mark complete:", e)
        }
    }

    const getStatusColor = (asset) => {
        // Calculate status based on dates for more reliability
        const today = new Date()
        today.setHours(0, 0, 0, 0); // Normalize today's date
        
        if (!asset.nextMaintenance) return 'status-upcoming'; // Handle null date

        // Ensure nextMaintenance is parsed as local date
        const nextDateParts = asset.nextMaintenance.split('-').map(Number);
        const nextDate = new Date(nextDateParts[0], nextDateParts[1] - 1, nextDateParts[2]);

        if (nextDate < today) return 'status-overdue'
        
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) return 'status-current' // e.g., due within 30 days
        
        return 'status-upcoming'
    }

    // --> Handle Auth0 loading state
    if (authIsLoading) {
        return <div className="loading-fullscreen">Authenticating...</div>
    }

    // --> Handle non-authenticated state
    if (!isAuthenticated) {
        // You should ideally redirect to login here,
        // but for a component, just showing a message is fine.
        return <div className="loading-fullscreen">Please log in to manage your assets.</div>
    }

    return (
        <div className="assets-page">
            <div className="page-header">
                <h1>{user?.given_name || 'Your'}'s Assets</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingAsset(null)
                        setFormData({
                            name: '', category: '', description: '', interval: 3,
                            lastMaintenance: format(new Date(), 'yyyy-MM-dd')
                        })
                        setShowAddForm(true)
                    }}
                >
                    <Plus size={16} />
                    Add Asset
                </button>
            </div>
            
            {/* --> Display a global error message if any API call fails */}
            {error && (
                <div className="error-banner">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* --> Add/Edit Modal (Form is the same) */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
                            <button 
                                className="btn-close"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingAsset(null)
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="asset-form">
                            {/* Form groups are unchanged */}
                            <div className="form-group">
                                <label htmlFor="name">Asset Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="interval">Maintenance Interval (months)</label>
                                    <input
                                        type="number"
                                        id="interval"
                                        value={formData.interval}
                                        onChange={(e) => setFormData({...formData, interval: parseInt(e.target.value) || 1})}
                                        min="1"
                                        max="120" // Increased max interval
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="lastMaintenance">Last Maintenance Date</label>
                                    <input
                                        type="date"
                                        id="lastMaintenance"
                                        value={formData.lastMaintenance}
                                        onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => {
                                    setShowAddForm(false)
                                    setEditingAsset(null)
                                }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingAsset ? 'Update Asset' : 'Add Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* --> Delete Confirmation Modal */}
            {showConfirmDelete && (
                <div className="modal-overlay">
                    <div className="modal modal-confirm">
                        <AlertTriangle size={48} className="text-red-500" />
                        <h2>Are you sure?</h2>
                        <p>
                            This will permanently delete the asset: 
                            <strong> {assets.find(a => a.id === showConfirmDelete)?.name}</strong>.
                        </p>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={() => setShowConfirmDelete(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger" // You'll need to style .btn-danger
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --> Show loading spinner while fetching data */}
            {isLoading ? (
                <div className="loading-fullscreen">Loading your assets...</div>
            ) : assets.length === 0 && !error ? ( // Only show empty state if no error
                // --> Empty state (no assets found)
                <div className="empty-state">
                    <Package size={64} />
                    <h3>No assets yet</h3>
                    <p>Add your first asset to start tracking maintenance schedules</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingAsset(null)
                            setFormData({
                                name: '', category: '', description: '', interval: 3,
                                lastMaintenance: format(new Date(), 'yyyy-MM-dd')
                            })
                            setShowAddForm(true)
                        }}
                    >
                        <Plus size={16} />
                        Add Your First Asset
                    </button>
                </div>
            ) : (
                // --> Assets grid (logic is the same, but now uses API data)
                <div className="assets-grid">
                    {assets.map(asset => {
                        // Ensure dates are valid before formatting
                        // JS Date constructor can be unreliable with 'yyyy-mm-dd'
                        const lastMaintDate = asset.lastMaintenance ? new Date(asset.lastMaintenance.replace(/-/g, '\/')) : null;
                        const nextMaintDate = asset.nextMaintenance ? new Date(asset.nextMaintenance.replace(/-/g, '\/')) : null;

                        return (
                            <div key={asset.id} className={`asset-card ${getStatusColor(asset)}`}>
                                <div className="asset-header">
                                    <div className="asset-info">
                                        <h3>{asset.name}</h3>
                                        <span className="asset-category">{asset.category}</span>
                                    </div>
                                    <div className="asset-actions">
                                        <button 
                                            className="btn-icon"
                                            onClick={() => handleEdit(asset)}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            className="btn-icon btn-icon-danger" // Style this
                                            onClick={() => handleDelete(asset.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                {asset.description && (
                                    <p className="asset-description">{asset.description}</p>
                                )}
                                
                                <div className="asset-details">
                                    <div className="detail-item">
                                        <Calendar size={14} />
                                        <span>Last: {lastMaintDate && !isNaN(lastMaintDate) ? format(lastMaintDate, 'MMM dd, yyyy') : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Calendar size={14} />
                                        <span>Next: {nextMaintDate && !isNaN(nextMaintDate) ? format(nextMaintDate, 'MMM dd, yyyy') : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Package size={14} />
                                        <span>Every {asset.interval} months</span>
                                    </div>
                                </div>
                                
                                <div className="asset-footer">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => markComplete(asset.id)}
                                    >
                                        Mark Complete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


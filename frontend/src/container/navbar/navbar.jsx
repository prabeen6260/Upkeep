import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Home, Package, Calendar, Settings, User, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const location = useLocation()
    const { user, logout, isAuthenticated } = useAuth0()
    const [showUserMenu, setShowUserMenu] = useState(false)
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/assets', label: 'Assets', icon: Package },
        { path: '/calendar', label: 'Calendar', icon: Calendar },
        { path: '/settings', label: 'Settings', icon: Settings }
    ]

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: meta.env.VITE_AUTH0_LOGOUT_REDIRECT_URI ||window.location.origin,
            },
        })
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Upkeep</h1>
                <span className="tagline">Home & Asset Maintenance</span>
            </div>
            
            <ul className="navbar-nav">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <li key={path}>
                        <Link 
                            to={path} 
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>

            {isAuthenticated && user && (
                <div className="navbar-user">
                    <div 
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="user-avatar">
                            {user.picture ? (
                                <img 
                                    src={user.picture} 
                                    alt={user.name || 'User'} 
                                    className="avatar-image"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name || 'User'}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                        <ChevronDown size={16} className={`chevron ${showUserMenu ? 'open' : ''}`} />
                    </div>

                    {showUserMenu && (
                        <div className="user-menu">
                            <div className="user-menu-header">
                                <div className="user-avatar-large">
                                    {user.picture ? (
                                        <img 
                                            src={user.picture} 
                                            alt={user.name || 'User'} 
                                            className="avatar-image"
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="user-details">
                                    <h4>{user.name || 'User'}</h4>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="user-menu-items">
                                <Link 
                                    to="/profile" 
                                    className="user-menu-item"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                <Link 
                                    to="/settings" 
                                    className="user-menu-item"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <div className="user-menu-divider"></div>
                                <button 
                                    className="user-menu-item logout"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}
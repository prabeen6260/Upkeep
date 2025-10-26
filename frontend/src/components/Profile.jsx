import { useAuth0 } from '@auth0/auth0-react'
import { User, Mail, Calendar, Shield, LogOut, Settings, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { meta } from '@eslint/js'

export default function Profile() {
  const { user, logout, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">
            <User size={48} className="spinning" />
          </div>
          <h2>Loading profile...</h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-state">
            <User size={48} />
            <h2>No user found</h2>
            <p>Please sign in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: import.meta.env.VITE_AUTH0_LOGOUT_REDIRECT_URI || window.location.origin,
      },
    })
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>User Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <User size={32} />
                </div>
              )}
            </div>

            <div className="profile-info">
              <h2>{user.name || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-badges">
                <span className="badge verified">
                  <Shield size={14} />
                  Verified Account
                </span>
                {user.email_verified && (
                  <span className="badge email-verified">
                    <Mail size={14} />
                    Email Verified
                  </span>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-outline">
                <Edit size={16} />
                Edit Profile
              </button>
              <button className="btn btn-outline">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">
                    <User size={16} />
                    Full Name
                  </div>
                  <div className="detail-value">
                    {user.name || 'Not provided'}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">
                    <Mail size={16} />
                    Email Address
                  </div>
                  <div className="detail-value">
                    {user.email || 'Not provided'}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">
                    <Calendar size={16} />
                    Member Since
                  </div>
                  <div className="detail-value">
                    {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'Unknown'}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">
                    <Shield size={16} />
                    Last Login
                  </div>
                  <div className="detail-value">
                    {user.updated_at ? format(new Date(user.updated_at), 'MMM dd, yyyy') : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Security & Privacy</h3>
              <div className="security-info">
                <div className="security-item">
                  <Shield size={20} />
                  <div className="security-text">
                    <h4>Secure Authentication</h4>
                    <p>Your account is protected by Auth0's enterprise-grade security</p>
                  </div>
                </div>
                <div className="security-item">
                  <Mail size={20} />
                  <div className="security-text">
                    <h4>Email Verification</h4>
                    <p>{user.email_verified ? 'Your email is verified' : 'Please verify your email address'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Account Actions</h3>
              <div className="action-buttons">
                <button className="btn btn-outline">
                  <Settings size={16} />
                  Account Settings
                </button>
                <button className="btn btn-outline">
                  <Shield size={16} />
                  Security Settings
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'
import Login from './Login'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, error } = useAuth0()

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>Loading...</h2>
          <p>Please wait while we verify your authentication.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-container">
          <h2>Authentication Error</h2>
          <p>There was an error with your authentication. Please try again.</p>
          <p className="error-details">{error.message}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return children
}

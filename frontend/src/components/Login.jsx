import { useAuth0 } from '@auth0/auth0-react'
import { LogIn, Shield, Home } from 'lucide-react'

export default function Login() {
  const { loginWithRedirect, isLoading } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        prompt: 'login',
      },
    })
  }

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="loading-spinner">
            <Shield size={48} className="spinning" />
          </div>
          <h2>Loading...</h2>
          <p>Please wait while we prepare your secure login.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <Home size={48} />
            <h1>Upkeep</h1>
          </div>
          <p className="login-tagline">Home & Asset Maintenance Scheduler</p>
        </div>

        <div className="login-content">
          <div className="login-card">
            <div className="login-card-header">
              <Shield size={32} />
              <h2>Welcome Back</h2>
              <p>Sign in to access your maintenance dashboard</p>
            </div>

            <div className="login-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <Home size={20} />
                </div>
                <div className="feature-text">
                  <h4>Track Assets</h4>
                  <p>Manage all your home and vehicle maintenance</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={20} />
                </div>
                <div className="feature-text">
                  <h4>Secure & Private</h4>
                  <p>Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <LogIn size={20} />
                </div>
                <div className="feature-text">
                  <h4>Easy Access</h4>
                  <p>Sign in with your preferred account</p>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-large"
              onClick={handleLogin}
            >
              <LogIn size={20} />
              Sign In Securely
            </button>

            <div className="login-footer">
              <p className="security-note">
                <Shield size={16} />
                Protected by Auth0 - Enterprise-grade authentication
              </p>
            </div>
          </div>
        </div>

        <div className="login-info">
          <h3>Why Choose Upkeep?</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🔒 Secure</h4>
              <p>Your data is encrypted and protected</p>
            </div>
            <div className="info-item">
              <h4>📱 Accessible</h4>
              <p>Available on all your devices</p>
            </div>
            <div className="info-item">
              <h4>📊 Smart</h4>
              <p>AI-powered maintenance scheduling</p>
            </div>
            <div className="info-item">
              <h4>⚡ Fast</h4>
              <p>Quick setup and easy to use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

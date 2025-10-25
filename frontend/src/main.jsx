import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'
import { auth0Config } from './config/auth0.js'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
      logoutParams={auth0Config.logoutParams}
      useRefreshTokens={auth0Config.useRefreshTokens}
      cacheLocation={auth0Config.cacheLocation}
    >
      <HashRouter>
        <App />
      </HashRouter>
    </Auth0Provider>
  </StrictMode>,
)

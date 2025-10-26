// Auth0 Configuration
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  logoutParams: {
    returnTo: import.meta.env.VITE_AUTH0_LOGOUT_REDIRECT_URI || window.location.origin,
    client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
}

// Auth0 Scopes
export const auth0Scopes = {
  openid: 'openid',
  profile: 'profile',
  email: 'email',
  readAssets: 'read:assets',
  writeAssets: 'write:assets',
  readMaintenance: 'read:maintenance',
  writeMaintenance: 'write:maintenance',
}

// Default scopes for login
export const defaultScopes = [
  auth0Scopes.openid,
  auth0Scopes.profile,
  auth0Scopes.email,
  auth0Scopes.readAssets,
  auth0Scopes.writeAssets,
  auth0Scopes.readMaintenance,
  auth0Scopes.writeMaintenance,
].join(' ')

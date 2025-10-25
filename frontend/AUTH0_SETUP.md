# Auth0 Setup Guide for Upkeep

This guide will help you set up Auth0 authentication for your Upkeep application.

## Step 1: Create Auth0 Account

1. Go to [Auth0.com](https://auth0.com) and sign up for a free account
2. Choose "Single Page Application" as your application type
3. Complete the account setup process

## Step 2: Configure Auth0 Application

1. **Navigate to Applications Dashboard**
   - Go to [Auth0 Dashboard](https://manage.auth0.com)
   - Click on "Applications" in the sidebar
   - Click "Create Application"

2. **Application Settings**
   - **Name**: `Upkeep Maintenance App`
   - **Type**: Single Page Application
   - **Technology**: React

3. **Configure Application Settings**
   - Go to your application settings
   - **Allowed Callback URLs**: `http://localhost:5176, http://localhost:5173, http://localhost:5174, http://localhost:5175`
   - **Allowed Logout URLs**: `http://localhost:5176, http://localhost:5173, http://localhost:5174, http://localhost:5175`
   - **Allowed Web Origins**: `http://localhost:5176, http://localhost:5173, http://localhost:5174, http://localhost:5175`
   - **Allowed Origins (CORS)**: `http://localhost:5176, http://localhost:5173, http://localhost:5174, http://localhost:5175`

## Step 3: Get Auth0 Credentials

1. **Copy Domain and Client ID**
   - From your application settings, copy:
     - **Domain** (e.g., `your-tenant.auth0.com`)
     - **Client ID** (e.g., `abc123def456ghi789`)

2. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

3. **Update Environment Variables**
   Edit `.env` file with your Auth0 credentials:
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_CLIENT_SECRET=your-client-secret
   VITE_AUTH0_REDIRECT_URI=http://localhost:5176
   VITE_AUTH0_LOGOUT_REDIRECT_URI=http://localhost:5176
   VITE_AUTH0_AUDIENCE=your-api-identifier
   ```

## Step 4: Configure Authentication Providers

1. **Enable Social Connections** (Optional)
   - Go to "Authentication" > "Social"
   - Enable providers like Google, Facebook, GitHub, etc.
   - Configure OAuth settings for each provider

2. **Configure Database Connection**
   - Go to "Authentication" > "Database"
   - Ensure "Username-Password-Authentication" is enabled
   - Configure password policies and user registration settings

## Step 5: Set Up User Management

1. **Configure User Registration**
   - Go to "Authentication" > "Database" > "Settings"
   - Enable "Disable Sign Ups" if you want to control user creation
   - Configure password policies

2. **Set Up User Metadata** (Optional)
   - Go to "User Management" > "Users"
   - You can add custom fields for user profiles

## Step 6: Configure API (Optional)

If you plan to add a backend API:

1. **Create API**
   - Go to "Applications" > "APIs"
   - Click "Create API"
   - **Name**: `Upkeep API`
   - **Identifier**: `https://api.upkeep.com` (or your domain)
   - **Signing Algorithm**: RS256

2. **Configure Scopes**
   - Add scopes like:
     - `read:assets`
     - `write:assets`
     - `read:maintenance`
     - `write:maintenance`

## Step 7: Test Authentication

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Login Flow**
   - Navigate to `http://localhost:5176`
   - You should see the login page
   - Click "Sign In Securely"
   - Complete the Auth0 login process
   - You should be redirected back to the dashboard

## Step 8: Production Deployment

When deploying to production:

1. **Update Environment Variables**
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_REDIRECT_URI=https://your-domain.com
   VITE_AUTH0_LOGOUT_REDIRECT_URI=https://your-domain.com
   ```

2. **Update Auth0 Application Settings**
   - Add production URLs to:
     - Allowed Callback URLs
     - Allowed Logout URLs
     - Allowed Web Origins
     - Allowed Origins (CORS)

## Security Features Included

✅ **Enterprise-Grade Security**
- OAuth 2.0 / OpenID Connect
- JWT tokens with RS256 signing
- Secure token storage
- Automatic token refresh

✅ **Multi-Factor Authentication**
- SMS, Email, Push notifications
- Hardware security keys
- Authenticator apps

✅ **Social Login Support**
- Google, Facebook, GitHub, LinkedIn
- Microsoft, Apple, Twitter
- Custom OAuth providers

✅ **User Management**
- User registration and profiles
- Password policies
- Account lockout protection
- Email verification

✅ **Compliance**
- SOC 2 Type II certified
- GDPR compliant
- HIPAA compliant options
- PCI DSS compliant

## Troubleshooting

**Common Issues:**

1. **"Invalid redirect URI"**
   - Check that your callback URL is exactly listed in Auth0 settings
   - Ensure no trailing slashes or typos

2. **"Application not found"**
   - Verify your domain and client ID are correct
   - Check that the application is active

3. **"CORS error"**
   - Add your domain to "Allowed Web Origins"
   - Ensure "Allowed Origins (CORS)" includes your domain

4. **"Token expired"**
   - Check that refresh tokens are enabled
   - Verify token expiration settings

**Need Help?**
- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Community](https://community.auth0.com)
- [Auth0 Support](https://support.auth0.com)

## Next Steps

Once Auth0 is configured:

1. **Backend Integration**: Connect your Spring Boot backend to validate Auth0 tokens
2. **User Roles**: Implement role-based access control
3. **API Protection**: Secure your API endpoints with Auth0 tokens
4. **Advanced Features**: Add MFA, custom domains, or enterprise features

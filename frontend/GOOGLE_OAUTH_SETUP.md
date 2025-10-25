# Google OAuth Setup with Auth0

## 🔍 Current Issue
You're getting an authentication error when trying to login with Google. This is because Google OAuth needs to be configured in your Auth0 dashboard.

## 🚀 Quick Fix (5 minutes)

### Step 1: Enable Google OAuth in Auth0

1. **Go to Auth0 Dashboard**
   - Visit: [https://manage.auth0.com](https://manage.auth0.com)
   - Navigate to: **Authentication** → **Social**

2. **Enable Google Connection**
   - Find "Google" in the list
   - Click the **toggle switch** to enable it
   - Click on "Google" to configure it

### Step 2: Configure Google OAuth

1. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Client**
   - **Application Type**: Web application
   - **Name**: Upkeep App (or any name)
   - **Authorized JavaScript origins**: 
     ```
     https://dev-6swto1ndp4wqynaq.us.auth0.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://dev-6swto1ndp4wqynaq.us.auth0.com/login/callback
     ```

3. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret**
   - You'll need these for Auth0

### Step 3: Configure Auth0 Google Connection

1. **In Auth0 Dashboard**
   - Go to: **Authentication** → **Social** → **Google**
   - Paste your Google **Client ID** and **Client Secret**
   - Click **Save**

2. **Configure Scopes** (Optional)
   - **Scopes**: `openid profile email`
   - **Attributes**: Leave default or customize

### Step 4: Update Auth0 Application Settings

1. **Go to Applications**
   - Navigate to: **Applications** → Your App → **Settings**

2. **Update URLs** (if port changed)
   - **Allowed Callback URLs**:
     ```
     http://localhost:5179
     ```
   - **Allowed Logout URLs**:
     ```
     http://localhost:5179
     ```
   - **Allowed Web Origins**:
     ```
     http://localhost:5179
     ```

### Step 5: Test Google Login

1. **Restart your dev server** (if needed)
2. **Go to**: `http://localhost:5179`
3. **Click**: "Sign In Securely"
4. **Click**: "Continue with Google" (if available)
5. **Complete**: Google OAuth flow

## 🔧 Alternative: Use Auth0's Test Google Connection

If you want to test quickly without setting up your own Google OAuth:

1. **In Auth0 Dashboard**
   - Go to: **Authentication** → **Social** → **Google**
   - Look for "Use Auth0's test connection" option
   - Enable it for testing purposes

**Note**: This is only for testing. For production, you need your own Google OAuth credentials.

## 🚨 Common Issues & Solutions

### "Invalid Client" Error
- **Cause**: Wrong Google Client ID/Secret
- **Fix**: Double-check credentials in Auth0 dashboard

### "Redirect URI Mismatch" Error
- **Cause**: Wrong redirect URI in Google Console
- **Fix**: Add `https://dev-6swto1ndp4wqynaq.us.auth0.com/login/callback`

### "Access Denied" Error
- **Cause**: Google OAuth not properly configured
- **Fix**: Verify all steps above

### "Connection Not Found" Error
- **Cause**: Google connection not enabled in Auth0
- **Fix**: Enable Google in Auth0 Social connections

## 📱 Additional Social Providers

You can also enable other providers:
- **Facebook**: Similar setup process
- **GitHub**: Easier setup, just need Client ID/Secret
- **Microsoft**: For Microsoft accounts
- **Apple**: For Apple ID login

## 🎯 Production Considerations

For production deployment:
1. **Update Google OAuth settings** with production domain
2. **Use environment variables** for different environments
3. **Configure proper scopes** based on your needs
4. **Set up proper error handling** for OAuth failures

## ✅ Success Indicators

- ✅ Google login button appears on Auth0 login page
- ✅ Clicking Google login redirects to Google OAuth
- ✅ After Google authentication, user returns to your app
- ✅ User profile shows Google account information
- ✅ No authentication errors in console

## 🆘 Need Help?

- **Auth0 Documentation**: [Social Connections](https://auth0.com/docs/connections/social)
- **Google OAuth Guide**: [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- **Auth0 Support**: Available in their dashboard

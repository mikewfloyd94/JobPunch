# JobPunch Authentication Setup Guide

This guide explains how to set up the authentication system for JobPunch using Supabase Auth and a custom users table.

## Overview

The authentication system uses:
- **Supabase Auth** - for credential management (email/password)
- **Custom users table** - for storing user metadata (name, role, etc.)
- **AuthContext** - for managing auth state across the app
- **PrivateRoute** - for protecting routes based on authentication and role

## Database Setup

### 1. Enable Supabase Auth

In your Supabase project:

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates if needed

### 2. Create Users Table

Create a custom `users` table to store role and additional user information:

```sql
-- Run this in Supabase SQL Editor

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'contractor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Set Up Row Level Security (RLS)

Enable RLS on the users table:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Service role can insert (for signup)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);
```

## Authentication Flow

### Signup

1. User creates account with email, password, name, and role
2. Supabase Auth creates a user in the `auth.users` table
3. AuthContext inserts a corresponding row in the `users` table with the role
4. User is automatically logged in
5. Redirected to dashboard based on role

### Login

1. User enters email and password
2. Supabase Auth authenticates the credentials
3. AuthContext fetches the user's role from the `users` table
4. User is redirected to appropriate portal

### Logout

1. User clicks "Sign Out"
2. AuthContext clears session from Supabase Auth
3. User state is cleared
4. User is redirected to landing page

## Using Authentication in Components

### Check Authentication Status

```javascript
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { isAuthenticated, loading, user, userRole } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <p>Role: {userRole}</p>
    </div>
  )
}
```

### Check User Role

```javascript
const { isManager, isContractor } = useAuth()

if (isManager) {
  // Show manager-specific features
}

if (isContractor) {
  // Show contractor-specific features
}
```

### Logout

```javascript
const { logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    // User will be redirected by AuthContext
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

return <button onClick={handleLogout}>Sign Out</button>
```

## Protecting Routes

### Using PrivateRoute

The `PrivateRoute` component protects routes and redirects unauthenticated users to login:

```javascript
import PrivateRoute from '@/components/PrivateRoute'

<Route
  path="/manager/*"
  element={
    <PrivateRoute requiredRole="manager">
      <ManagerDashboard />
    </PrivateRoute>
  }
/>
```

### Route Types

- **Public routes**: `/`, `/login`, `/signup` - accessible to everyone
- **Protected routes**: `/manager/*`, `/contractor/*` - require authentication + matching role
- **Loading state**: PrivateRoute shows loading indicator while checking auth

## Pages and Components

### Auth Pages

- **Login** (`/login`) - Sign in with email/password
- **Signup** (`/signup`) - Create new account with role selection
- **Landing** (`/`) - Home page with portal selection

### Components

- **PrivateRoute** - Route protection wrapper
- **AuthContext** - Global auth state and functions
- **AuthProvider** - Context provider (wraps entire app)

## Environment Variables

Your `.env.local` file should contain:

```
VITE_SUPABASE_URL=https://vurngvdhrkqranaejyuj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The app automatically uses Supabase Auth when these are configured.

## File Structure

```
src/
├── pages/Auth/
│   ├── Login.jsx         # Login page
│   └── Signup.jsx        # Signup page
├── context/
│   ├── AuthContext.jsx   # Auth state management
│   └── SupabaseContext.jsx
├── components/
│   └── PrivateRoute.jsx  # Route protection
├── styles/
│   └── Auth.css          # Auth pages styling
└── App.jsx               # Updated with auth routes
```

## API Functions

The auth system is built into `AuthContext`:

```javascript
const { login, signup, logout } = useAuth()

// Login
await login(email, password)

// Signup
await signup(email, password, name, role)

// Logout
await logout()
```

## Error Handling

All auth functions throw errors on failure. Handle them in your components:

```javascript
try {
  await login(email, password)
} catch (error) {
  console.error('Login failed:', error.message)
  setError(error.message)
}
```

## Troubleshooting

### "User not found" on login

- Verify the email exists in your auth.users table
- Check that password is correct

### Role not loading

- Ensure the users table row exists for the auth user
- Check RLS policies allow reading the users table
- Verify the role column has the correct value

### Can't access protected routes

- Verify you're logged in: `useAuth()` should return `isAuthenticated: true`
- Check your role matches the required role
- Check browser console for error messages

### Session lost on refresh

- This is normal behavior - auth state is checked on app load
- AuthContext initializes from Supabase Auth on mount
- Session persists in Supabase by default

## Security Best Practices

1. **Never commit `.env.local`** - Add to .gitignore
2. **Use HTTPS in production** - Supabase requires secure connections
3. **Enable RLS on all tables** - Protect data with row-level security
4. **Validate on backend** - Never trust client-side role checks alone
5. **Set strong password requirements** - Enforce minimum password length
6. **Enable MFA** - Consider enabling multi-factor authentication

## Next Steps

After setting up authentication:

1. Customize user profile page
2. Add password reset functionality
3. Implement email verification
4. Add user management in admin dashboard
5. Set up role-based access control (RBAC) for APIs

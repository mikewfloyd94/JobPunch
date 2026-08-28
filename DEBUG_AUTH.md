# Debugging Authentication Issues

If unauthenticated users can still access `/contractor` or `/manager` without logging in, use this guide to diagnose the problem.

## Quick Test

1. Start the app: `npm run dev`
2. Open browser DevTools: Press **F12**
3. Go to **Console** tab
4. Open a new tab and navigate to: `http://localhost:5173/contractor`
5. Look at console output for `[AuthContext]` and `[PrivateRoute]` logs

## What to Look For

### Expected Behavior (Auth Working ✅)
```
[App] Mounting with AuthProvider
[AuthContext] Initializing auth...
[AuthContext] Supabase configured: true
[AuthContext] getUser returned: null
[AuthContext] No user, setting to null
[AuthContext] Auth initialization complete
[PrivateRoute] Auth state: { user: 'null', loading: false, userRole: null, requiredRole: 'contractor', shouldRedirect: true }
[PrivateRoute] No user found, redirecting to /login
```

Then you should be redirected to `/login`

### Problem Signs ❌

#### Problem 1: Missing Environment Variables
```
[AuthContext] Supabase configured: false
[AuthContext] Supabase not properly configured - missing env variables
```

**Fix:** 
- Check `.env.local` file exists in project root
- Verify it has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after adding env variables
- See `SUPABASE_SETUP_STEPS.md` for how to get credentials

#### Problem 2: User Not Being Set to Null
```
[AuthContext] getUser returned: null
[AuthContext] No user, setting to null
[PrivateRoute] Auth state: { user: 'User: someone@email.com', loading: false, ...}
```

This means `user` is NOT null even though getUser returned null. This is a state sync bug.

**Fix:**
- Clear browser cache and cookies for localhost
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check DevTools → Application → Local Storage → delete all items
- Clear Session Storage too

#### Problem 3: Loading Never Completes
```
[AuthContext] Initializing auth...
[AuthContext] Supabase configured: true
[AuthContext] getUser returned: null
[PrivateRoute] Showing loading state
[PrivateRoute] Showing loading state
[PrivateRoute] Showing loading state
...
```

**Fix:**
- The loading state is stuck. This might indicate:
  - `setLoading(false)` is never called
  - An error in `fetchUserRole` is preventing completion
  - The onAuthStateChange listener isn't properly set up

## Step-by-Step Debugging

### Step 1: Verify Environment Variables
```bash
# In the JobPunch root directory, check .env.local
cat .env.local
```

Should show:
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

If empty or missing, see `SUPABASE_SETUP_STEPS.md`

### Step 2: Check Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Look for `[AuthContext]` and `[PrivateRoute]` logs
4. Match output to "What to Look For" section above

### Step 3: Check if User is Cached
1. DevTools → Application tab
2. Expand "Local Storage" → select `http://localhost:5173`
3. Look for entries like:
   - `sb-...auth.token`
   - `sb-...auth.user`
4. If found, right-click and delete these entries
5. Refresh the page and check console logs again

### Step 4: Check Session Storage
1. DevTools → Application tab
2. Expand "Session Storage" → select `http://localhost:5173`
3. Delete any Supabase-related entries
4. Refresh and check console logs

### Step 5: Restart Everything
If still not working:
1. Stop dev server (Ctrl+C)
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache for localhost
4. Delete `.env.local` and recreate it with correct values
5. Restart dev server: `npm run dev`
6. Check console logs again

## Common Issues and Solutions

### "Supabase not properly configured - missing env variables"
→ Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`

### "No user found, redirecting to /login" but doesn't redirect
→ Hard refresh browser (Ctrl+Shift+R)
→ Clear Local Storage and Session Storage
→ Restart dev server

### Can access `/contractor` without logging in
→ User is unexpectedly not null
→ Clear browser storage (Local Storage + Session Storage)
→ Check console for "User not found, redirecting to /login" logs

### User gets stuck on loading screen
→ Check if `[AuthContext] Auth initialization complete` appears in logs
→ If not, there's an error preventing completion
→ Check browser console for any red error messages

### After logout, can still access portal
→ Clear browser storage (Local Storage + Session Storage)
→ Check that `[AuthContext] Auth state changed: signedout` appears in logs
→ Verify `[PrivateRoute] No user found, redirecting to /login` logs

## What Each Log Means

| Log | Meaning |
|-----|---------|
| `[App] Mounting with AuthProvider` | App is starting up with auth system |
| `[AuthContext] Initializing auth...` | Checking for existing session |
| `[AuthContext] Supabase configured: true/false` | Env variables are/aren't set |
| `[AuthContext] getUser returned: User: email@...` | Session exists from this user |
| `[AuthContext] getUser returned: null` | No session, user not logged in |
| `[AuthContext] User role fetched: manager` | User's role found in database |
| `[AuthContext] Auth initialization complete` | Auth setup finished |
| `[PrivateRoute] Auth state:` | Current auth values when route checked |
| `[PrivateRoute] No user found, redirecting to /login` | Unauthenticated user being redirected |
| `[PrivateRoute] Access granted for: contractor` | Authenticated user with correct role allowed in |

## If Nothing Works

1. Try in an **incognito/private window** - this clears all storage
2. If it works in incognito, the issue is stored browser data
   - Clear all browser data for localhost
   - Close and reopen browser
3. If it still doesn't work:
   - Check browser console for red error messages (take a screenshot)
   - Verify `.env.local` has correct credentials
   - Try logging in and checking if user data is saved in Supabase (check Supabase dashboard)

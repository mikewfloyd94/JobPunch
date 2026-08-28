# Supabase Setup - Step by Step Guide

Follow these simple steps to set up JobPunch with Supabase.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or sign in
3. Click "New Project"
4. Enter project name: `jobpunch`
5. Create a strong database password and save it
6. Click "Create new project"
7. Wait for the project to initialize (2-3 minutes)

## Step 2: Get Your Credentials

After the project initializes:

1. Click on your project name
2. Go to **Settings** → **API**
3. Copy the following:
   - **Project URL** (starts with `https://`)
   - **anon public** key (under "Project API keys")
4. Keep these safe - you'll need them soon

## Step 3: Set Up Environment Variables

1. Open `.env.local` in the JobPunch project root
2. Add these lines with your credentials:

```
VITE_SUPABASE_URL=YOUR_PROJECT_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

3. Save the file

**Example:**
```
VITE_SUPABASE_URL=https://vurngvdhrkqranaejyuj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Open the file `src/DATABASE_SIMPLE_SETUP.sql` from the JobPunch project
4. Copy ALL the SQL code (the entire file)
5. Paste it into the Supabase SQL Editor
6. Click the blue **"Run"** button
7. Wait for the query to complete (should see "Success" message)

If you get an error, see the **Troubleshooting** section below.

## Step 5: Test the Connection

1. Save `.env.local` (if you haven't already)
2. Start the app:
   ```
   npm install
   npm run dev
   ```
3. Open the app in your browser (usually `http://localhost:5173`)
4. Look for a **green dot** in the bottom-right corner
   - ✅ Green = Database connected
   - ❌ Red = Connection failed

Check browser console (F12) for detailed error messages.

## Step 6: Create Your First Account

1. Click "Sign Up" on the landing page
2. Choose a role:
   - **Manager** - See manager dashboard
   - **Contractor** - See contractor portal
3. Fill in email and password
4. Click "Create Account"
5. You should be logged in and see your dashboard!

## Step 7: Verify Everything Works

- [ ] Can sign up with email/password
- [ ] Can see appropriate dashboard (manager or contractor)
- [ ] Can click "Sign Out"
- [ ] After logout, clicking portal shows login screen
- [ ] Green database indicator shows connection

## What Each Table Does

### users
Stores user information:
- `id` - User ID from Supabase Auth
- `email` - User's email
- `name` - User's full name
- `role` - Either "manager" or "contractor"

### jobs
Construction projects:
- `id` - Job ID
- `name` - Job name/title
- `description` - Job details
- `created_by` - Manager who created it

### punch_items
Work tasks for each job:
- `id` - Task ID
- `job_id` - Which job it belongs to
- `description` - Task description
- `status` - open, in_progress, completed, or closed

### messages
Communication:
- `id` - Message ID
- `job_id` - Which job it's about
- `from_user` - Who sent it
- `message` - Message text

## Troubleshooting

### "Error: syntax error"
- Make sure you copied the ENTIRE SQL file
- Check that you're in the SQL Editor, not the AI Chat
- Try clicking "Run" again

### "User not found" when signing in
- The user account wasn't created in the `users` table
- This usually means the signup failed
- Try signing up again
- Check browser console for error messages

### Red database indicator after setup
- Check your `.env.local` file has the correct credentials
- Verify you copied the entire URL and key (no missing characters)
- Restart the dev server after changing `.env.local`
- Make sure the tables were created (run Step 4 again if unsure)

### "Permission denied" error
- Wait 30 seconds after creating the project - it might still be initializing
- Refresh the page and try again
- If still failing, delete the project and create a new one

### App says "Database connection failed"
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Copy the error and troubleshoot:
   - "not authenticated" = .env variables are wrong
   - "network error" = Supabase might be down (check status.supabase.com)
   - "table does not exist" = SQL tables weren't created

## Next Steps

Once everything is working:

1. **Create a job** in the manager dashboard
2. **Assign punch items** (tasks) to the job
3. **Send messages** between managers and contractors
4. **Update task status** as work progresses

## Need Help?

- Supabase Docs: https://supabase.com/docs
- JobPunch Auth Guide: See `AUTH_SETUP.md`
- Supabase Status: https://status.supabase.com

---

**Notes:**
- `.env.local` is in `.gitignore` - it won't be committed to version control ✓
- Never share your Supabase anon key with others (it's fine to share, it's public)
- The database is yours - you can manage it directly in Supabase if needed

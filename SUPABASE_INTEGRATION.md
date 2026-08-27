# Supabase Integration Guide

This document explains how the JobPunch app integrates with Supabase for backend services.

## Configuration

### Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=https://vurngvdhrkqranaejyuj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get your anon key from your Supabase project:
1. Go to Supabase Dashboard
2. Select your project
3. Navigate to Settings → API → anon (public) key
4. Copy and paste the key to `.env.local`

### Files Structure

```
src/
├── config/
│   └── supabase.js              # Supabase client initialization
├── services/
│   └── api.js                   # API functions for data operations
├── hooks/
│   ├── useSupabaseQuery.js       # Hook for fetching data with loading states
│   └── useSupabaseMutation.js    # Hook for create/update operations
├── context/
│   └── SupabaseContext.jsx       # Global Supabase context provider
└── utils/
    └── supabaseHelpers.js       # Helper functions
```

## API Service Functions

### Projects/Jobs

```javascript
import { 
  fetchProjects, 
  fetchProjectById, 
  createProject, 
  updateProject 
} from '@/services/api'

// Fetch all projects
const { data, error } = await fetchProjects()

// Fetch single project
const { data, error } = await fetchProjectById('project-id')

// Create new project
const { data, error } = await createProject({
  name: 'New Project',
  description: 'Project details...'
})

// Update project
const { data, error } = await updateProject('project-id', {
  status: 'in_progress'
})
```

### Punch Items

```javascript
import {
  fetchPunchItems,
  createPunchItem,
  updatePunchItem
} from '@/services/api'

// Fetch punch items (all or by project)
const { data, error } = await fetchPunchItems()
const { data, error } = await fetchPunchItems('project-id')

// Create punch item
const { data, error } = await createPunchItem({
  project_id: 'project-id',
  trade_id: 'trade-id',
  description: 'Item description...'
})

// Update punch item
const { data, error } = await updatePunchItem('item-id', {
  status: 'completed'
})
```

### Messages

```javascript
import {
  fetchMessages,
  createMessage
} from '@/services/api'

// Fetch messages
const { data, error } = await fetchMessages()
const { data, error } = await fetchMessages('project-id')

// Create message
const { data, error } = await createMessage({
  project_id: 'project-id',
  author_id: 'user-id',
  content: 'Message content...'
})
```

### Trades

```javascript
import {
  fetchTrades,
  fetchTradeById
} from '@/services/api'

// Fetch all trades
const { data, error } = await fetchTrades()

// Fetch single trade
const { data, error } = await fetchTradeById('trade-id')
```

## Using Hooks in Components

### useSupabaseQuery Hook

For fetching data with automatic loading and error states:

```javascript
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { fetchProjects } from '@/services/api'

function ProjectsList() {
  const { data: projects, loading, error } = useSupabaseQuery(
    () => fetchProjects(),
    [] // dependencies
  )

  if (loading) return <div>Loading projects...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {projects?.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

### useSupabaseMutation Hook

For create/update operations with loading and error states:

```javascript
import { useSupabaseMutation } from '@/hooks/useSupabaseMutation'
import { createProject } from '@/services/api'

function CreateProjectForm() {
  const { mutate, loading, error } = useSupabaseMutation(createProject)

  const handleSubmit = async (formData) => {
    const { data, error } = await mutate(formData)
    if (!error) {
      console.log('Project created:', data)
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e.target.elements)}>
        {/* form fields */}
      </form>
      {loading && <p>Creating...</p>}
      {error && <p>Error: {error.message}</p>}
    </>
  )
}
```

## Using Supabase Context Provider

Wrap your app with the SupabaseProvider to access global Supabase state:

```javascript
import { SupabaseProvider } from '@/context/SupabaseContext'
import App from './App'

function Root() {
  return (
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  )
}
```

Then access Supabase in any component:

```javascript
import { useSupabase } from '@/context/SupabaseContext'

function MyComponent() {
  const { isConnected, isLoading, error } = useSupabase()

  if (isLoading) return <div>Connecting to database...</div>
  if (!isConnected) return <div>Database connection failed</div>

  return <div>Database is connected!</div>
}
```

## Database Connection Status

The app displays a subtle status indicator in the bottom-right corner:
- **Green dot**: Database connected successfully
- **Red dot**: Database connection failed
- **Amber dot**: Checking connection status

Open browser console to see detailed connection messages.

## Error Handling

All API functions return `{ data, error }` objects:

```javascript
const { data, error } = await fetchProjects()

if (error) {
  console.error('Failed to fetch projects:', error.message)
  // Handle error
} else {
  // Use data
}
```

Use the helper function for consistent error handling:

```javascript
import { handleSupabaseError } from '@/utils/supabaseHelpers'

const { data, error } = await fetchProjects()
if (error) {
  const message = handleSupabaseError(error, 'Failed to load projects')
}
```

## Retry Logic

For operations that might fail temporarily:

```javascript
import { retryOperation } from '@/utils/supabaseHelpers'

const data = await retryOperation(
  () => fetchProjects(),
  3,      // max retries
  1000    // delay in ms
)
```

## Database Tables

The app expects the following Supabase tables:

- `projects` - Construction projects
- `punch_items` - Punch list items
- `messages` - Project messages
- `trades` - Trade types/categories

Refer to your Supabase schema for exact column definitions.

## Development Tips

1. **Test connection**: The app automatically tests the Supabase connection on startup. Check browser console for status.

2. **Mock data**: For development without backend, mock the API functions.

3. **Real-time updates**: Supabase supports real-time subscriptions. Extend `api.js` to add `.on()` listeners.

4. **Authentication**: Add authentication by importing `supabase.auth` methods.

5. **Row-level security**: Configure RLS policies in Supabase for production.

## Troubleshooting

**"Missing Supabase environment variables"**
- Ensure `.env.local` exists and has the correct keys
- Restart dev server after adding environment variables

**Database connection failed**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Check browser network tab for failed requests
- Ensure Supabase project is accessible

**No data returned**
- Verify table names match your Supabase schema
- Check row-level security policies allow access
- Test queries directly in Supabase SQL Editor

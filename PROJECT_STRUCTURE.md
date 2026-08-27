# JobPunch Project Structure

## Overview
JobPunch is a construction management application built with React and Vite, featuring a Manager Dashboard and Contractor Portal.

## Directory Structure

```
jobpunch/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── manager/         # Manager-specific components
│   │   └── contractor/      # Contractor-specific components
│   ├── pages/               # Page components (routes)
│   │   ├── manager/
│   │   │   ├── Dashboard.jsx
│   │   │   └── pages/       # Sub-pages
│   │   │       ├── Projects.jsx
│   │   │       ├── Teams.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── Settings.jsx
│   │   ├── contractor/
│   │   │   ├── Portal.jsx
│   │   │   └── pages/       # Sub-pages
│   │   │       ├── Assignments.jsx
│   │   │       ├── Timesheets.jsx
│   │   │       ├── Messages.jsx
│   │   │       └── Profile.jsx
│   │   └── LandingPage.jsx
│   ├── styles/              # CSS stylesheets
│   │   ├── manager/
│   │   │   └── Dashboard.css
│   │   ├── contractor/
│   │   │   └── Portal.css
│   │   └── LandingPage.css
│   ├── hooks/               # Custom React hooks (future)
│   ├── context/             # Context API providers (future)
│   ├── utils/               # Utility functions (future)
│   ├── services/            # API services (future)
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
├── .eslintrc.cjs            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── .gitignore               # Git ignore file
└── README.md                # Project readme
```

## Key Features

### Manager Dashboard (`/manager`)
- **Overview**: Dashboard overview and quick stats
- **Projects**: Manage construction projects
- **Teams**: Manage team members and assignments
- **Reports**: View project reports and analytics
- **Settings**: Dashboard settings and preferences

### Contractor Portal (`/contractor`)
- **Dashboard**: Quick overview and status
- **Assignments**: View and manage work assignments
- **Timesheets**: Submit and track timesheets
- **Messages**: Communicate with managers
- **Profile**: Manage contractor profile

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Technologies

- **React 18.2** - UI library
- **React Router 6.20** - Client-side routing
- **Vite 5.0** - Build tool and dev server
- **Axios 1.6** - HTTP client
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Development Workflow

1. Start the dev server: `npm install && npm run dev`
2. Navigate to `http://localhost:5173`
3. Make changes - Vite will hot-reload automatically
4. Lint and format: `npm run lint && npm run format`
5. Build for production: `npm run build`

## Future Enhancements

- Authentication and authorization
- API integration with backend
- Real-time messaging system
- Advanced analytics and reporting
- Mobile-responsive improvements
- State management (Redux/Zustand)
- Testing suite (Jest, React Testing Library)

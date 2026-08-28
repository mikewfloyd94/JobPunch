# JobPunch

Construction management application built with React and Vite, featuring separate interfaces for project managers and contractors.

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd jobpunch
   npm install
   ```

2. **Set up database** (5 minutes)
   - Follow the step-by-step guide: [SUPABASE_SETUP_STEPS.md](./SUPABASE_SETUP_STEPS.md)
   - This sets up authentication and data tables

3. **Start development server**
   ```bash
   npm run dev
   ```

The app will open at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start Vite dev server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on source code
- `npm run format` - Format code with Prettier

## Project Architecture

### Two Main Portals

**Manager Dashboard** (`/manager`)
- Centralized project management
- Team and resource allocation
- Real-time progress tracking
- Reporting and analytics

**Contractor Portal** (`/contractor`)
- Work assignments and schedules
- Timesheet management
- Direct communication with managers
- Profile and document management

### Technology Stack

- **Frontend**: React 18.2, React Router 6.20
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite 5.0
- **HTTP Client**: Axios 1.6, Supabase JS Client
- **Dev Tools**: ESLint, Prettier

## Documentation

- **[SUPABASE_SETUP_STEPS.md](./SUPABASE_SETUP_STEPS.md)** - Step-by-step database setup guide
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication implementation details
- **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - API and data integration guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Folder organization and components

## Directory Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed folder organization and component hierarchy.

## Development Guidelines

- Components are organized by portal (manager/contractor)
- Each feature page has its own sub-directory
- Shared utilities go in `src/utils/`
- API calls go in `src/services/`
- Custom hooks in `src/hooks/`
- Global state in `src/context/`

## Features

### Implemented ✅
- [x] User authentication (email/password via Supabase)
- [x] Role-based access (Manager/Contractor)
- [x] Protected routes with PrivateRoute component
- [x] Database integration with Supabase
- [x] Two separate portals (Manager Dashboard / Contractor Portal)

### Planned
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Enhanced user profiles
- [ ] File upload capabilities

## Contributing

1. Create a feature branch
2. Make your changes
3. Lint and format: `npm run lint && npm run format`
4. Commit with clear messages
5. Push and create a pull request

## License

[Add license information here]
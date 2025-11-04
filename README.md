# Savify

**AI-Powered Financial Coaching Platform**

Savify is a comprehensive web application that provides intelligent financial coaching designed to help individuals with irregular income patterns achieve financial wellness. The platform leverages artificial intelligence to analyze user behavior, identify spending patterns, assess financial risks, and deliver personalized recommendations for improved financial health.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Backend Services](#backend-services)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- **AI-Powered Financial Coaching**: Personalized guidance that adapts to individual financial patterns and goals
- **Behavioral Analysis**: Advanced pattern recognition for spending habits and financial behaviors
- **Risk Assessment**: Intelligent identification of potential financial risks and vulnerabilities
- **Tailored Recommendations**: Customized advice based on individual financial situations and objectives
- **Multi-Platform Authentication**: Secure sign-in support for email, Google, GitHub, and Microsoft accounts
- **Real-time Dashboard**: Interactive financial dashboard with expense tracking and analytics
- **Chat Interface**: AI-powered conversational interface for financial guidance and support

### User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS for professional appearance
- **Real-time Updates**: Dynamic content updates and interactive elements
- **Accessibility**: WCAG compliant interface design for inclusive user experience
- **Performance Optimized**: Fast loading times and smooth interactions

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development environment
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **React Router** - Client-side routing and navigation
- **React Query** - Server state management and caching
- **Framer Motion** - Animation and motion graphics

### Backend & Services
- **Firebase** - Authentication and real-time database
- **Supabase** - Additional backend services and database management
- **FastAPI** - Python-based API backend (optional deployment)
- **PostgreSQL** - Primary database for production environments
- **Redis** - Caching and session management

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation and type checking

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Joohhnnyyy/savify.git
   cd savify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

   Backend API configuration (optional but recommended for production/dev alignment):
   ```env
   # Prefer setting one of these to the backend base URL
   VITE_API_URL=https://your-backend.example.com
   # or
   VITE_BACKEND_URL=https://your-backend.example.com

   # If your backend is mounted under a path prefix (e.g., behind a reverse proxy):
   # Examples: "/loan", "/api/v1" (do not include trailing slash)
   VITE_API_PREFIX=/loan
   ```

   Notes:
   - In development, if `VITE_API_URL`/`VITE_BACKEND_URL` are not set, the app uses Vite’s proxy at `/api`.
   - `VITE_API_PREFIX` helps when your FastAPI app is served under a subpath; the frontend will try both prefixed and non-prefixed endpoints to avoid 404s.
   - If you see `Not Found` for all endpoints, verify your backend base URL and any mount prefix, then set `VITE_API_URL` and `VITE_API_PREFIX` accordingly.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## Project Structure

```
savify/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── robots.txt
│   ├── fonts/             # Custom font files
│   └── *.mp4              # Video assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Site footer
│   │   └── ...           # Other components
│   ├── contexts/          # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   │   ├── firebase.ts   # Firebase configuration
│   │   ├── supabase.ts   # Supabase configuration
│   │   └── utils.ts      # Utility functions
│   ├── pages/             # Application pages/routes
│   │   ├── Index.tsx     # Landing page
│   │   ├── LoginPage.tsx # Authentication page
│   │   ├── FinancialDashboard.tsx # Main dashboard
│   │   └── ...           # Other pages
│   └── assets/            # Images and other assets
├── backend/               # Backend deployment configuration
│   ├── Dockerfile        # Docker configuration
│   ├── docker-compose.yml # Multi-service deployment
│   ├── requirements.txt  # Python dependencies
│   └── ...               # Other backend files
├── supabase/              # Supabase configuration
│   ├── config.toml       # Supabase configuration
│   └── migrations/       # Database migrations
└── configuration files    # Various config files
```

## Deployment

### Frontend Deployment (Vercel)

The application is configured for seamless deployment on Vercel:

1. **Automatic Deployment**
   ```bash
   ./deploy.sh
   ```

2. **Manual Deployment**
   ```bash
   npm run build
   npx vercel --prod
   ```

3. **Environment Variables**
   Configure the following in your Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### Backend Deployment

Multiple deployment options are available:

1. **Docker Deployment**
   ```bash
   cd backend
   ./deploy-backend.sh
   ```

2. **Cloud Platforms**
   - Railway
   - Render
   - Heroku
   - Google Cloud Run
   - AWS ECS/Fargate

## Backend Services

### API Backend
The project includes a comprehensive backend setup with:
- FastAPI-based REST API
- PostgreSQL database with optimized schema
- Redis caching layer
- Nginx reverse proxy configuration
- Docker containerization
- Health monitoring and logging

### Database Schema
- User management and profiles
- Financial accounts and transactions
- Budget tracking and goals
- AI conversation history
- Audit logging and security

## Development Guidelines

### Code Quality
- TypeScript for type safety and better developer experience
- ESLint configuration for consistent code style
- Component-based architecture with reusable components
- Responsive design principles and mobile-first approach

### Performance
- Vite for fast development and optimized building
- Code splitting and lazy loading for better performance
- Optimized asset delivery and caching strategies
- Efficient state management with React Query

### Security
- Environment variable management for sensitive data
- Secure authentication flows with Firebase
- Data validation and sanitization
- HTTPS enforcement in production environments

## Contributing

We welcome contributions to improve Savify. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all contributions follow our coding standards and include appropriate tests.

## License

This project is proprietary software. All rights reserved.

---

**Savify** - Transforming financial wellness through intelligent, personalized AI coaching.

For more information, visit our documentation or contact our development team.

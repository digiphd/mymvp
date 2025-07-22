# MyMVP.io

> AI-Powered MVP Development Platform

A modern, interactive landing page for MyMVP.io - a premium AI-powered development service that transforms startup ideas into production-ready MVPs. Built with Next.js 15, React 19, and featuring stunning Three.js visualizations.

![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.178.0-orange?style=flat&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=flat&logo=tailwind-css)

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive requirements collection through natural conversation using Vercel AI SDK
- **Modern Landing Page**: Conversion-optimized design with sections for hero, comparison, process, philosophy, pricing, and FAQ
- **Interactive 3D Visualizations**: Stunning Three.js components including neural networks, code flows, and interactive particle systems
- **Progressive Sign-up Flow**: Seamless chat-to-signup conversion (coming soon)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion animations throughout the user experience
- **Email Integration**: Automated email notifications via Nodemailer
- **Modern UI Components**: Built with Radix UI primitives and custom components

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and visualizations

### UI & Components
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Class Variance Authority** - Component variants

### Backend & API
- **Next.js API Routes** - Serverless API endpoints
- **Nodemailer** - Email sending functionality

## 📁 Project Structure

```
mymvp-platform/                  # Monorepo root
├── apps/
│   ├── web/                     # Next.js frontend app
│   │   ├── src/app/            # Next.js App Router
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── chat/           # AI chat interface
│   │   │   ├── dashboard/      # User portal (future)
│   │   │   └── api/            # Next.js API routes (AI streaming)
│   │   ├── components/         # React components
│   │   │   ├── chat/          # Chat-specific components
│   │   │   ├── sections/      # Landing page sections
│   │   │   ├── three/         # Three.js components
│   │   │   └── ui/            # UI components
│   │   └── lib/               # Utilities
│   └── api/                    # Express API server
│       ├── src/
│       │   ├── routes/        # API routes
│       │   ├── services/      # Business logic
│       │   ├── middleware/    # Auth, validation
│       │   └── types/         # API-specific types
│       └── package.json
├── packages/
│   ├── shared/                # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types.ts      # Common TypeScript types
│   │   │   └── index.ts      # Utility functions
│   │   └── package.json
│   ├── database/             # Supabase schemas and migrations
│   │   ├── src/
│   │   │   └── schema.sql    # Database schema
│   │   └── package.json
│   └── ui/                   # Shared UI components (future)
├── package.json              # Root workspace configuration
├── pnpm-workspace.yaml       # PNPM workspace setup
└── turbo.json               # Turbo build configuration
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mymvp-platform.git
   cd mymvp-platform
   ```

2. **Install dependencies (monorepo)**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files for each app
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```
   
   Configure the following variables:
   ```env
   # Web App (.env.local)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # API (.env)
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   
   # AI Configuration
   OPENAI_API_KEY=your-openai-key
   # or
   ANTHROPIC_API_KEY=your-anthropic-key
   ```

4. **Start the development servers**
   ```bash
   # Start all apps
   pnpm dev
   
   # Or start individually
   pnpm web:dev    # Frontend on :3000
   pnpm api:dev    # API on :3001
   ```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🎨 Key Components

### Three.js Visualizations
- **InteractiveNetwork**: Mouse-responsive particle network
- **NeuralNetwork**: Animated neural network visualization  
- **CodeFlow**: Flowing code particles animation
- **PulsingGrid**: Animated background grid system

### Landing Page Sections
- **HeroSection**: Main value proposition with 3D elements
- **ComparisonSection**: Traditional vs AI-powered development
- **ProcessSection**: Step-by-step development process
- **PhilosophySection**: Core development principles
- **PricingSection**: Two-tier pricing (POC vs MVP)
- **FAQSection**: Common questions and answers

### Application Flow
- Multi-step form with progress tracking
- Technical vision assessment
- Growth readiness evaluation
- Partnership fit analysis
- Automated email notifications

## ⚙️ Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color palette
- Typography scale
- Animation utilities
- Responsive breakpoints

### Three.js Setup
3D components are optimized for performance with:
- Fiber renderer
- Automatic cleanup
- Responsive canvas sizing
- Mouse interaction handling

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js configuration
- Consistent component structure
- Modular CSS with Tailwind

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions about this project or MyMVP.io services:

- Website: [mymvp.io](https://mymvp.io)
- Email: hello@mymvp.io

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using Next.js, React, and Three.js**

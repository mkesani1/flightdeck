# FlightDeck

SaaS Command Center for Solo Founders

FlightDeck is a modern operations dashboard designed for solo founders to manage their business, monitor AI agents, and handle critical interventions—all from one unified interface.

## Features

- **Live Operations Dashboard** - Real-time visibility into your business metrics and status
- **AI Agent Management** - Deploy, monitor, and control AI agents powering your operations
- **Single-Page Onboarding** - Quick and intuitive setup to get you operational in minutes
- **Intervention System** - Handle critical issues and exceptions with a streamlined workflow

## Tech Stack

- **React 19** - Latest React with Server Components support
- **TypeScript** - Type-safe development for reliability
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Supabase** - Open-source Firebase alternative for backend services

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Obtain these values from your Supabase project settings.

## Screenshots

[Dashboard placeholder]
[AI Agent Management placeholder]
[Intervention System placeholder]

## Deployment

FlightDeck is optimized for deployment on Vercel.

1. Connect your repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy:
   ```bash
   npm run build
   ```

For detailed Vercel deployment instructions, see [Vercel Documentation](https://vercel.com/docs)

## License

MIT

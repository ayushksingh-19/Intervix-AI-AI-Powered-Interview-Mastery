# Intervix AI

Intervix AI is a Next.js-based mock interview platform that helps users practice role-specific interviews with AI-generated questions, recorded responses, and structured feedback.

The project combines a modern frontend with optional AI, authentication, and database integrations so it can be used as both a portfolio project and a foundation for a more complete interview-preparation product.

## Features

- Generate interview question sets tailored to a job role, description, and experience level
- Practice interview responses with microphone and webcam support
- Review answers with AI-assisted scoring and feedback
- Browse previous interview sessions from a dashboard
- Use Clerk-based authentication when configured
- Run the app locally with partial setup while integrating services incrementally

## Tech Stack

- Framework: Next.js 14, React 18
- Styling: Tailwind CSS, shadcn/ui, Radix UI
- AI: Google Gemini
- Authentication: Clerk
- Database: Drizzle ORM with Neon/Postgres
- Utilities: Lucide React, Moment, React Webcam, Speech-to-Text hooks

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ayushksingh-19/Intervix-AI-AI-Powered-Interview-Mastery.git
cd Intervix-AI-AI-Powered-Interview-Mastery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

```bash
cp .env.example .env.local
```

If you are using Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 4. Configure environment variables

Add values to `.env.local` as needed:

```env
NEXT_PUBLIC_QUESTION_NOTE="Click on Record Answer when you want to answer the question..."
NEXT_PUBLIC_INTERVIEW_QUESTION=5
NEXT_PUBLIC_INFORMATION="Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview..."
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_DRIZZLE_DB_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

### Required for full functionality

- `NEXT_PUBLIC_GEMINI_API_KEY`: Enables interview generation and AI feedback
- `NEXT_PUBLIC_DRIZZLE_DB_URL`: Enables interview persistence and feedback history
- `CLERK_SECRET_KEY`: Enables secure Clerk server-side authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Enables Clerk client-side authentication

### Optional for local preview

The app can still boot without Clerk configured. In that case, it falls back to a local guest-mode experience for basic navigation and UI preview.

Without Gemini and the database configured, the app will load, but interview generation and saved session history will not be fully available.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
npm run db:studio
```

## Database Setup

Push the schema to your configured database:

```bash
npm run db:push
```

Open Drizzle Studio:

```bash
npm run db:studio
```

## Project Structure

```text
app/                  Next.js App Router pages and layouts
components/           Reusable UI and auth helpers
lib/                  Shared configuration utilities
public/               Static assets
utils/                Database, schema, and AI helpers
```

## Notes on API Key Safety

If you plan to use Gemini in production, do not expose private API keys directly to the browser.

At the moment, this project reads the Gemini key from `NEXT_PUBLIC_GEMINI_API_KEY`, which makes it available to client-side code. That may be acceptable for quick local experiments, but it is not the recommended production approach.

For a production-safe setup, move Gemini requests behind a server-side API route and keep the secret in a non-public environment variable.

## Roadmap Ideas

- Move AI calls to server-side routes
- Add a dedicated demo mode with seeded mock data
- Improve validation and error handling across interview flows
- Add automated tests for interview generation and feedback
- Support multiple interview templates and difficulty levels

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

This project currently does not include a license file. Add one if you plan to distribute or open-source it formally.

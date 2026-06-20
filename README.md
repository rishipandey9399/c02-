# CarbonTrack

CarbonTrack is a production-grade, full-stack, AI-powered carbon footprint tracking web application built using Next.js 14 App Router, Tailwind CSS, TanStack Query, Zustand, Recharts, and Google Gemini API.

It allows users to calculate their carbon footprint through a lightweight questionnaire, view category breakdowns and comparison benchmarks, get personalised reduction recommendations from Gemini, set goals, and securely track progress over time.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.x (Strict mode enforced)
- **Styling:** Tailwind CSS 3.x
- **Components:** Radix UI primitives & Custom Components (built following shadcn/ui architectural design)
- **State Management:** Zustand 4.x (Client UI / questionnaire state), TanStack Query 5.x (Server-state caching)
- **Visualisations:** Recharts 2.x (Donut breakdowns and historical trend area charts)
- **AI Integration:** Google Gemini API (`gemini-2.0-flash` model, server-side only)
- **Database & Auth:** Google Cloud Firestore (user-scoped data isolation) & Firebase Authentication
- **Rate Limiting:** Upstash Redis
- **Testing:** Vitest (unit tests), Jest + MSW (integration API mocks), Playwright (E2E)

## Project Structure

```
footprint/
├── .storybook/              # Storybook configurations
├── src/
│   ├── app/                 # Next.js pages, layouts and API routes
│   │   ├── api/             # Next.js Serverless API endpoints
│   │   ├── calculator/      # Public questionnaire wizard
│   │   └── globals.css      # Core styles & variables (light/dark mode)
│   ├── components/
│   │   ├── ai/              # Recommendation and chat components
│   │   ├── calculator/      # Interactive question blocks
│   │   └── charts/          # Donut and benchmark visualisations
│   ├── constants/           # Emission factors and constants
│   ├── hooks/               # Zustand hooks, TanStack Query calls & a11y hooks
│   ├── lib/                 # Core logic (calculator, firebase configs, Gemini)
│   ├── schemas/             # Zod input schemas for validation
│   ├── stores/              # Zustand global client-side state
│   └── types/               # Type-safe model interfaces
├── tests/
│   ├── integration/         # API endpoint integration mocks
│   └── unit/                # Unit tests for calculations, schemas & prompts
├── package.json             # Core dependencies
├── tsconfig.json            # Strict compiler checks
├── tailwind.config.ts       # Design token system
└── next.config.js           # CSP headers & Remote image optimizations
```

## Getting Started

### Prerequisites

- Node.js v20.x or higher
- Upstash Redis account (for rate limiting)
- Firebase project (Authentication and Firestore enabled)
- Google AI Studio API key (for Gemini)

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd footprint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Copy the example file and fill in your keys:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000).

## Running Tests

CarbonTrack enforces test coverage standards of $\geq 80\%$ for core business logic (calculators, schemas, auth, and API routes), while UI components are verified via Storybook and Playwright E2E flows.

- Run unit and schema tests (Vitest):
  ```bash
  npm run test:unit
  ```

- Run integration tests:
  ```bash
  npm run test:integration
  ```

- Run Playwright E2E tests (requires production build running):
  ```bash
  npm run build
  npm run test:e2e
  ```

## Accessibility & Security Compliance

- **WCAG 2.1 Level AA:** Enforces semantic headings, aria-live announce regions, focus management on wizard step changes, and screen reader-friendly tabular alternatives for SVG charts.
- **Content Security Policy (CSP):** Implemented in `next.config.js` to block unauthorized scripts, connections, and iframe injections.
- **Data Isolation:** Enforced via Firebase Admin verify token middleware and Firestore user-scoped security rules.

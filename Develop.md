# CarbonTrack — Engineering Prompt & Technical Specification

> **Document Type:** Full-Stack Engineering Brief  
> **Version:** 1.0.0  
> **Status:** Ready for Development  
> **Last Updated:** June 2026  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Code Quality Standards](#4-code-quality-standards)
5. [Accessibility Requirements](#5-accessibility-requirements)
6. [Security Architecture](#6-security-architecture)
7. [Testing Strategy](#7-testing-strategy)
8. [Google Services Integration](#8-google-services-integration)
9. [AI Integration — Gemini API](#9-ai-integration--gemini-api)
10. [API Design & Contracts](#10-api-design--contracts)
11. [Performance Standards](#11-performance-standards)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Development Workflow](#13-development-workflow)
14. [Environment Variables Reference](#14-environment-variables-reference)
15. [Acceptance Criteria](#15-acceptance-criteria)

---

## 1. Project Overview

### 1.1 Mission Statement

Build **CarbonTrack** — a production-grade, full-stack web application that helps individuals understand, track, and reduce their personal carbon footprint through a guided lifestyle questionnaire, AI-powered personalised recommendations (Google Gemini API), real-time data visualisation, and authenticated progress tracking.

### 1.2 Core User Flows

```
[Public] Questionnaire → Footprint Result → AI Plan (Gemini) → Sign Up / Sign In
[Authenticated] Dashboard → Progress Tracking → History → Goals → Community
```

### 1.3 Non-Negotiable Requirements

- WCAG 2.1 AA accessibility compliance
- Lighthouse score ≥ 90 on all four categories (Performance, Accessibility, Best Practices, SEO)
- Firebase Authentication — Google Sign-In + Email/Password
- All Gemini API calls proxied through server-side API routes — keys never exposed to the client
- TypeScript strict mode with zero `any` types in production code
- Test coverage ≥ 80% for business logic, ≥ 60% overall

---

## 2. Technology Stack

### 2.1 Frontend

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 14.x | SSR/SSG, file-based routing, API routes, edge runtime |
| Language | **TypeScript** | 5.x | Type safety, DX, refactor confidence |
| Styling | **Tailwind CSS** | 3.x | Utility-first, performant, consistent design tokens |
| Components | **shadcn/ui** | Latest | Accessible Radix primitives, unstyled by default, owned code |
| State — Server | **TanStack Query** (React Query) | 5.x | Server state, caching, background sync, optimistic updates |
| State — Client | **Zustand** | 4.x | Minimal client state (UI state, questionnaire progress) |
| Charts | **Recharts** | 2.x | React-native, accessible SVG charts, composable |
| Forms | **React Hook Form** + **Zod** | Latest | Zero re-renders, schema validation, TypeScript inference |
| Animation | **Framer Motion** | 11.x | Purposeful transitions, reduced-motion respect |
| Icons | **Lucide React** | Latest | Consistent, tree-shakeable, accessible |

### 2.2 Backend

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Runtime | **Next.js API Routes** (Edge + Node.js) | 14.x | Co-located with frontend, serverless by default |
| Validation | **Zod** | 3.x | Runtime schema validation for all API inputs |
| ORM | **Prisma** | 5.x | Type-safe database client, migration management |
| Database | **Cloud Firestore** (Google) | — | Real-time, serverless, scales to zero |
| Auth | **Firebase Authentication** | v10 (modular) | Google Sign-In, Email/Password, JWT verification |
| AI | **Google Gemini API** | `gemini-2.0-flash` | Primary AI model for personalised insights |
| Rate Limiting | **Upstash Redis** (via Vercel KV) | — | API rate limiting, session caching |
| Email | **Resend** | Latest | Transactional email (welcome, digest) |

### 2.3 Infrastructure & DevOps

| Layer | Technology | Reason |
|---|---|---|
| Hosting | **Vercel** | Zero-config Next.js deployment, edge network |
| Database | **Google Cloud Firestore** | Native Firebase SDK, real-time subscriptions |
| Storage | **Google Cloud Storage** | User profile images, exported reports |
| Analytics | **Google Analytics 4** | Event tracking, conversion funnels |
| Error Tracking | **Sentry** | Error monitoring, performance tracing |
| CI/CD | **GitHub Actions** | Lint → Test → Build → Deploy pipeline |
| Container Registry | **Google Artifact Registry** | Docker images for any containerised services |
| Secrets | **Google Secret Manager** | Production secrets management |

### 2.4 Developer Tooling

| Tool | Purpose |
|---|---|
| **ESLint** + `@typescript-eslint` | Static analysis, code consistency |
| **Prettier** | Opinionated code formatting |
| **Husky** + **lint-staged** | Pre-commit hooks |
| **Commitizen** + **Conventional Commits** | Standardised commit messages |
| **Changesets** | Versioning and changelog automation |
| **Storybook** | Component development and documentation |

---

## 3. Project Structure

```
carbontrack/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint, type-check, test on PR
│   │   ├── deploy-preview.yml        # Vercel preview deploy on PR
│   │   └── deploy-production.yml     # Deploy to production on main merge
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── .husky/
│   ├── pre-commit                    # lint-staged
│   └── commit-msg                   # commitlint
│
├── prisma/
│   ├── schema.prisma                 # Data models
│   └── migrations/                  # Database migration history
│
├── public/
│   ├── icons/                        # App icons, favicons, PWA manifest icons
│   ├── images/                       # Static images (OG images, logos)
│   └── manifest.json                 # PWA manifest
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Authenticated layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Footprint overview + charts
│   │   │   ├── history/
│   │   │   │   └── page.tsx          # Historical tracking timeline
│   │   │   ├── goals/
│   │   │   │   └── page.tsx          # Goal-setting + progress
│   │   │   └── settings/
│   │   │       └── page.tsx          # Profile, notifications, data export
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx            # Public layout
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   ├── calculator/
│   │   │   └── page.tsx              # Public questionnaire (no auth required)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts      # NextAuth handler
│   │   │   ├── footprint/
│   │   │   │   ├── calculate/
│   │   │   │   │   └── route.ts      # POST: calculate + save footprint
│   │   │   │   └── history/
│   │   │   │       └── route.ts      # GET: user footprint history
│   │   │   ├── ai/
│   │   │   │   ├── recommendations/
│   │   │   │   │   └── route.ts      # POST: Gemini recommendations (server-side)
│   │   │   │   └── chat/
│   │   │   │       └── route.ts      # POST: streaming Gemini chat
│   │   │   ├── goals/
│   │   │   │   └── route.ts          # CRUD goal management
│   │   │   └── user/
│   │   │       └── route.ts          # User profile CRUD
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx
│   │   ├── layout.tsx                # Root layout (providers, fonts, meta)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui generated components (DO NOT EDIT)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── calculator/               # Questionnaire components
│   │   │   ├── QuestionnaireWizard.tsx
│   │   │   ├── QuestionStep.tsx
│   │   │   ├── OptionCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ResultsPanel.tsx
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── FootprintSummary.tsx
│   │   │   ├── CategoryBreakdown.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   └── ActionItem.tsx
│   │   ├── ai/                      # AI-powered components
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── AIChat.tsx
│   │   │   └── InsightStream.tsx    # Streaming response renderer
│   │   ├── charts/                  # Recharts wrappers
│   │   │   ├── DonutChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   └── BarComparison.tsx
│   │   ├── auth/
│   │   │   ├── GoogleSignInButton.tsx
│   │   │   ├── AuthGuard.tsx
│   │   │   └── UserMenu.tsx
│   │   └── shared/
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx
│   │       ├── PageHeader.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── admin.ts              # Firebase Admin SDK (server-side)
│   │   │   ├── client.ts             # Firebase Client SDK (browser)
│   │   │   └── firestore.ts          # Typed Firestore helpers
│   │   ├── gemini/
│   │   │   ├── client.ts             # Gemini SDK initialisation
│   │   │   ├── prompts.ts            # All system prompts and templates
│   │   │   └── safety.ts             # Gemini safety settings config
│   │   ├── carbon/
│   │   │   ├── calculator.ts         # Core emission factor calculations
│   │   │   ├── factors.ts            # Emission factor constants (typed)
│   │   │   └── categories.ts         # Category metadata (labels, colours, icons)
│   │   ├── analytics/
│   │   │   ├── gtag.ts               # GA4 event helpers
│   │   │   └── events.ts             # Typed event catalogue
│   │   ├── auth/
│   │   │   └── session.ts            # Server-side session utilities
│   │   ├── rate-limit.ts             # Upstash rate limiter
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── utils.ts                  # General utilities (cn, formatters)
│   │
│   ├── hooks/
│   │   ├── useFootprint.ts           # Footprint data + mutations
│   │   ├── useRecommendations.ts     # AI recommendations state
│   │   ├── useGoals.ts               # Goal CRUD hooks
│   │   ├── useAuth.ts                # Firebase auth state
│   │   ├── useReducedMotion.ts       # Respects prefers-reduced-motion
│   │   └── useMediaQuery.ts          # Responsive breakpoint hook
│   │
│   ├── stores/
│   │   ├── calculatorStore.ts        # Questionnaire progress (Zustand)
│   │   └── uiStore.ts                # UI state (sidebar, modals)
│   │
│   ├── types/
│   │   ├── carbon.ts                 # Footprint, Category, EmissionFactor types
│   │   ├── user.ts                   # UserProfile, UserGoal types
│   │   ├── api.ts                    # API request/response types
│   │   ├── gemini.ts                 # Gemini response types
│   │   └── analytics.ts              # GA4 event types
│   │
│   ├── schemas/
│   │   ├── footprint.schema.ts       # Zod schemas — footprint validation
│   │   ├── user.schema.ts            # Zod schemas — user profile
│   │   └── goal.schema.ts            # Zod schemas — goal creation
│   │
│   └── constants/
│       ├── emission-factors.ts       # Typed emission constants
│       ├── routes.ts                 # Application route constants
│       └── config.ts                 # App-level configuration
│
├── tests/
│   ├── unit/
│   │   ├── lib/carbon/calculator.test.ts
│   │   ├── lib/gemini/prompts.test.ts
│   │   └── schemas/footprint.schema.test.ts
│   ├── integration/
│   │   ├── api/footprint.test.ts
│   │   ├── api/recommendations.test.ts
│   │   └── api/goals.test.ts
│   ├── e2e/
│   │   ├── calculator-flow.spec.ts   # Full questionnaire → results
│   │   ├── auth-flow.spec.ts         # Sign in → dashboard
│   │   └── goal-management.spec.ts
│   └── helpers/
│       ├── setup.ts
│       ├── mocks/firebase.ts
│       └── mocks/gemini.ts
│
├── stories/                          # Storybook stories
│   ├── OptionCard.stories.tsx
│   ├── RecommendationCard.stories.tsx
│   └── DonutChart.stories.tsx
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── gemini-prompts.md
│
├── .env.local.example                # Template — never commit .env.local
├── .eslintrc.json
├── .prettierrc
├── commitlint.config.js
├── jest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 4. Code Quality Standards

### 4.1 TypeScript Configuration

```json
// tsconfig.json — strict settings (non-negotiable)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Rules:**
- Zero `any` types in `/src`. Use `unknown` and narrow appropriately.
- All API responses validated with Zod before use — never trust raw JSON.
- All async functions must handle errors explicitly — no silent `catch` blocks.
- Prefer `type` over `interface` for object shapes unless extending is required.

### 4.2 ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "jsx-a11y", "import"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "import/order": ["error", { "alphabetize": { "order": "asc" } }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

### 4.3 Code Style Rules

**Naming Conventions:**

| Construct | Convention | Example |
|---|---|---|
| Components | PascalCase | `FootprintSummary.tsx` |
| Hooks | camelCase with `use` prefix | `useFootprint.ts` |
| Utilities | camelCase | `calculateEmissions.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_EMISSION_VALUE` |
| Types / Interfaces | PascalCase | `UserProfile`, `FootprintResult` |
| Zod schemas | camelCase with `Schema` suffix | `footprintSchema` |
| API routes | kebab-case directories | `/api/ai/recommendations` |
| CSS classes | Tailwind utilities only — no custom class names |

**File Organisation Rules:**
- One component per file. No barrel files for components.
- Co-locate tests with source when unit tests are simple: `utils.ts` → `utils.test.ts`
- Server-only code in `/lib` must include `import 'server-only'` at the top.
- Client components require `'use client'` as the first line. Default to Server Components.

### 4.4 Component Architecture

```tsx
// CORRECT — Server Component by default
// src/components/dashboard/FootprintSummary.tsx

import type { FootprintResult } from '@/types/carbon'
import { formatTons } from '@/lib/utils'

interface FootprintSummaryProps {
  result: FootprintResult
  comparisonYear?: number
}

export function FootprintSummary({ result, comparisonYear }: FootprintSummaryProps) {
  return (
    <section aria-labelledby="footprint-summary-heading">
      <h2 id="footprint-summary-heading" className="sr-only">
        Your carbon footprint summary
      </h2>
      {/* ... */}
    </section>
  )
}
```

```tsx
// CORRECT — Client Component only when interactivity is required
'use client'

// src/components/calculator/OptionCard.tsx
import { useCalculatorStore } from '@/stores/calculatorStore'

interface OptionCardProps {
  value: string
  label: string
  description: string
  emissionValue: number
  category: string
}

export function OptionCard({ value, label, description, emissionValue, category }: OptionCardProps) {
  const { selectedAnswers, selectAnswer } = useCalculatorStore()
  const isSelected = selectedAnswers[category] === value

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-describedby={`${value}-description`}
      onClick={() => selectAnswer(category, value)}
      className={cn(
        'w-full text-left rounded-xl border p-4 transition-all',
        isSelected
          ? 'border-emerald-500 border-2 bg-emerald-50 dark:bg-emerald-950'
          : 'border-border hover:bg-muted'
      )}
    >
      {/* ... */}
    </button>
  )
}
```

### 4.5 Commit Convention (Conventional Commits)

```
feat(calculator): add air travel step to questionnaire wizard
fix(ai): handle Gemini streaming timeout gracefully
docs(api): update recommendations endpoint contract
test(carbon): add unit tests for emission factor edge cases
refactor(auth): extract session validation to shared utility
perf(charts): memoize DonutChart data transformation
chore(deps): upgrade gemini-api-sdk to 2.1.0
a11y(calculator): add aria-live region for step transitions
```

---

## 5. Accessibility Requirements

**Standard:** WCAG 2.1 Level AA — mandatory, not aspirational.

### 5.1 Structural Requirements

```tsx
// Every page must have:
// 1. A single <h1> that describes the page
// 2. Logical heading hierarchy (h1 → h2 → h3)
// 3. A skip-to-main-content link as the first focusable element
// 4. A <main> landmark with id="main-content"
// 5. Proper <nav> landmarks with aria-label

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}
```

### 5.2 Interactive Components

| Component | Requirement |
|---|---|
| Questionnaire options | `role="radiogroup"` on group, `role="radio"` + `aria-checked` on each option |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| Charts (Recharts) | `role="img"` with `aria-label` describing the data; include a data table alternative |
| Modals / Dialogs | Focus trap, `role="dialog"`, `aria-labelledby`, `aria-modal="true"`, Escape key close |
| Toast notifications | `role="status"` for informational, `role="alert"` for errors; `aria-live="polite"` |
| Loading states | `aria-busy="true"` on container; `aria-live="polite"` region for completion |
| Form errors | `aria-describedby` pointing to error message; `aria-invalid="true"` on invalid field |

### 5.3 Colour & Contrast

- Normal text: minimum 4.5:1 contrast ratio
- Large text (≥18px regular or ≥14px bold): minimum 3:1 ratio
- UI components and graphical objects: minimum 3:1 ratio against adjacent colours
- Never use colour as the **only** means of conveying information — pair with text, icon, or pattern

```tsx
// CORRECT — colour + text + icon together
<span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
  <TrendingDown className="h-4 w-4" aria-hidden="true" />
  <span>Easy</span>
</span>

// WRONG — colour alone
<span className="text-green-500">Easy</span>
```

### 5.4 Keyboard Navigation

- All interactive elements reachable via Tab key
- Focus indicator visible at all times (never `outline: none` without a replacement)
- Logical tab order that follows visual reading order
- Multi-step wizard: focus moves to heading of new step on navigation

```tsx
// src/hooks/useFocusStep.ts
export function useFocusStep(step: number) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  return headingRef
}
```

### 5.5 Motion & Animation

```tsx
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
```

```tsx
// Usage in animated component
const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
>
```

### 5.6 Screen Reader Testing Matrix

| Screen Reader | Browser | Platform | Status Required |
|---|---|---|---|
| NVDA 2024.x | Chrome | Windows | ✅ Passing |
| JAWS 2024 | Chrome / Edge | Windows | ✅ Passing |
| VoiceOver | Safari | macOS / iOS | ✅ Passing |
| TalkBack | Chrome | Android | ✅ Passing |

---

## 6. Security Architecture

### 6.1 Authentication & Authorisation

```
Client  →  Firebase Auth SDK  →  Google / Email Provider
                ↓ (ID Token)
Client  →  Next.js API Route  →  Firebase Admin verifyIdToken()
                ↓ (Verified UID)
              Business Logic  →  Firestore (user-scoped data)
```

**Rules:**
- All authenticated API routes must call `verifyIdToken()` before processing
- User data in Firestore is scoped by UID — no cross-user data access ever
- Firestore Security Rules enforce data isolation at the database level (not just application level)
- Sessions expire after 1 hour; refresh tokens rotate on use

```typescript
// src/lib/auth/session.ts
import 'server-only'
import { adminAuth } from '@/lib/firebase/admin'
import { type NextRequest, NextResponse } from 'next/server'

export async function requireAuth(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new NextResponse(null, { status: 401 })
  }

  const token = authHeader.split('Bearer ')[1]
  if (!token) throw new NextResponse(null, { status: 401 })

  try {
    const decoded = await adminAuth.verifyIdToken(token, true) // checkRevoked = true
    return decoded.uid
  } catch {
    throw new NextResponse(null, { status: 401 })
  }
}
```

### 6.2 Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Footprint records are user-scoped
    match /footprints/{userId}/records/{recordId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Goals are user-scoped
    match /goals/{userId}/items/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Block all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6.3 API Security

```typescript
// src/lib/rate-limit.ts — Applied to all AI endpoints
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests/minute per user
  analytics: true,
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

  if (!success) {
    throw new Response(
      JSON.stringify({ error: 'Rate limit exceeded', reset }),
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    )
  }
}
```

### 6.4 Input Validation — All Routes

```typescript
// src/app/api/footprint/calculate/route.ts
import { z } from 'zod'
import { footprintInputSchema } from '@/schemas/footprint.schema'

export async function POST(request: NextRequest) {
  const uid = await requireAuth(request)

  // Parse and validate — never trust raw body
  const body: unknown = await request.json()
  const parsed = footprintInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // Proceed with validated data
  const result = calculateFootprint(parsed.data)
  // ...
}
```

### 6.5 Security Headers (next.config.js)

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://storage.googleapis.com https://lh3.googleusercontent.com",
      "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com wss://s-usc1c-nss-2006.firebaseio.com",
      "font-src 'self'",
      "frame-src 'none'",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
]
```

### 6.6 Gemini API — Prompt Injection Defence

```typescript
// src/lib/gemini/safety.ts
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai'

export const GEMINI_SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Sanitise user-controlled strings before injecting into prompts
export function sanitiseForPrompt(input: string): string {
  return input
    .replace(/[<>]/g, '') // strip angle brackets
    .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
    .trim()
    .slice(0, 500) // hard cap on injected string length
}
```

---

## 7. Testing Strategy

### 7.1 Testing Pyramid

```
         ┌─────────────┐
         │   E2E Tests │  ← Playwright  (10–15 critical paths)
         │  (Slowest)  │
         └──────┬──────┘
         ┌──────┴──────┐
         │ Integration │  ← Jest + MSW  (API routes, DB interactions)
         │    Tests    │
         └──────┬──────┘
    ┌───────────┴───────────┐
    │       Unit Tests      │  ← Vitest  (Pure functions, schemas, calculations)
    │   (Fastest, Most)     │
    └───────────────────────┘
```

**Coverage Targets:**
- `src/lib/carbon/` — 95%+ (critical business logic)
- `src/lib/gemini/` — 80%+ (prompt construction, response parsing)
- `src/schemas/` — 100% (Zod schemas — every valid and invalid case)
- `src/app/api/` — 70%+ (API route integration tests)
- `src/components/` — 60%+ (component rendering and interaction)
- Overall — ≥ 65%

### 7.2 Unit Tests — Carbon Calculator

```typescript
// tests/unit/lib/carbon/calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculateFootprint, EMISSION_FACTORS } from '@/lib/carbon/calculator'

describe('calculateFootprint', () => {
  it('returns correct total for a car-alone, heavy-meat, gas, frequent-flyer profile', () => {
    const result = calculateFootprint({
      transport: 'car-alone',
      diet: 'heavy-meat',
      energy: 'gas-fossil',
      flights: 'frequent',
    })

    expect(result.transport).toBe(EMISSION_FACTORS.transport['car-alone'])
    expect(result.diet).toBe(EMISSION_FACTORS.diet['heavy-meat'])
    expect(result.energy).toBe(EMISSION_FACTORS.energy['gas-fossil'])
    expect(result.flights).toBe(EMISSION_FACTORS.flights.frequent)
    expect(result.goods).toBe(2.0)
    expect(result.total).toBeCloseTo(
      result.transport + result.diet + result.energy + result.flights + result.goods,
      2
    )
  })

  it('returns minimum footprint for cycling, vegan, renewable, no-flights profile', () => {
    const result = calculateFootprint({
      transport: 'cycling',
      diet: 'vegan',
      energy: 'renewable',
      flights: 'none',
    })

    expect(result.total).toBeLessThan(4) // below world average
  })

  it('returns total below Paris 2050 target for optimal profile', () => {
    const result = calculateFootprint({
      transport: 'cycling',
      diet: 'vegan',
      energy: 'renewable',
      flights: 'none',
    })

    // Goods baseline always present — total won't be zero
    expect(result.total).toBeGreaterThan(0)
    expect(result.goods).toBe(2.0)
  })

  it('throws on invalid category value', () => {
    expect(() =>
      calculateFootprint({
        transport: 'helicopter' as never, // invalid value
        diet: 'vegan',
        energy: 'renewable',
        flights: 'none',
      })
    ).toThrow()
  })
})
```

### 7.3 Schema Tests

```typescript
// tests/unit/schemas/footprint.schema.test.ts
import { describe, it, expect } from 'vitest'
import { footprintInputSchema } from '@/schemas/footprint.schema'

describe('footprintInputSchema', () => {
  it('accepts a valid complete input', () => {
    const result = footprintInputSchema.safeParse({
      transport: 'car-alone',
      diet: 'moderate-meat',
      energy: 'mixed',
      flights: 'occasional',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = footprintInputSchema.safeParse({ transport: 'car-alone' })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors).toHaveProperty('diet')
  })

  it('rejects invalid enum values', () => {
    const result = footprintInputSchema.safeParse({
      transport: 'submarine',
      diet: 'moderate-meat',
      energy: 'mixed',
      flights: 'occasional',
    })
    expect(result.success).toBe(false)
  })
})
```

### 7.4 API Integration Tests (with MSW)

```typescript
// tests/integration/api/recommendations.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const MOCK_GEMINI_RESPONSE = {
  candidates: [{
    content: {
      parts: [{
        text: JSON.stringify({
          recommendations: [
            { title: 'Switch to public transit', detail: 'Test detail', saving: '~2.0t/yr', difficulty: 'Medium' }
          ]
        })
      }]
    }
  }]
}

const server = setupServer(
  http.post('https://generativelanguage.googleapis.com/*', () => {
    return HttpResponse.json(MOCK_GEMINI_RESPONSE)
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('POST /api/ai/recommendations', () => {
  it('returns structured recommendations for a valid profile', async () => {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-valid-token',
      },
      body: JSON.stringify({
        transport: 'car-alone',
        diet: 'heavy-meat',
        energy: 'gas-fossil',
        flights: 'frequent',
      }),
    })

    expect(response.status).toBe(200)
    const data: unknown = await response.json()
    // validate response shape
  })

  it('returns 401 without a valid auth token', async () => {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transport: 'car-alone', diet: 'vegan', energy: 'renewable', flights: 'none' }),
    })
    expect(response.status).toBe(401)
  })

  it('returns 429 when rate limit is exceeded', async () => {
    // Exhaust rate limit
    const requests = Array.from({ length: 11 }, () =>
      fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer mock-valid-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ transport: 'cycling', diet: 'vegan', energy: 'renewable', flights: 'none' }),
      })
    )
    const responses = await Promise.all(requests)
    const lastResponse = responses[responses.length - 1]
    expect(lastResponse?.status).toBe(429)
  })
})
```

### 7.5 E2E Tests (Playwright)

```typescript
// tests/e2e/calculator-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Calculator questionnaire flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator')
  })

  test('completes all 4 steps and shows results', async ({ page }) => {
    // Welcome screen
    await expect(page.getByRole('heading', { name: /your carbon footprint/i })).toBeVisible()
    await page.getByRole('button', { name: /get started/i }).click()

    // Step 1 — Transport
    await expect(page.getByText('1 of 4')).toBeVisible()
    await page.getByRole('radio', { name: /drive alone/i }).click()
    await page.getByRole('button', { name: /next/i }).click()

    // Step 2 — Diet
    await expect(page.getByText('2 of 4')).toBeVisible()
    await page.getByRole('radio', { name: /mixed diet/i }).click()
    await page.getByRole('button', { name: /next/i }).click()

    // Step 3 — Energy
    await expect(page.getByText('3 of 4')).toBeVisible()
    await page.getByRole('radio', { name: /mixed energy/i }).click()
    await page.getByRole('button', { name: /next/i }).click()

    // Step 4 — Flights
    await expect(page.getByText('4 of 4')).toBeVisible()
    await page.getByRole('radio', { name: /occasional flyer/i }).click()
    await page.getByRole('button', { name: /see my footprint/i }).click()

    // Results
    await expect(page.getByText(/t CO₂e \/ year/i)).toBeVisible()
    await expect(page.getByRole('img', { name: /donut chart/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /quick wins/i })).toBeVisible()
  })

  test('next button is disabled until an option is selected', async ({ page }) => {
    await page.getByRole('button', { name: /get started/i }).click()
    const nextButton = page.getByRole('button', { name: /next/i })
    await expect(nextButton).toBeDisabled()
    await page.getByRole('radio', { name: /drive alone/i }).click()
    await expect(nextButton).toBeEnabled()
  })

  test('is fully keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab') // Focus skip link or first focusable
    await page.keyboard.press('Enter')  // Activate get started
    // Continue keyboard navigation...
    await expect(page.getByText('1 of 4')).toBeVisible()
  })

  test('meets accessibility requirements on results page', async ({ page }) => {
    // Complete the flow...
    const accessibilityScanResults = await page.accessibility.snapshot()
    expect(accessibilityScanResults).not.toBeNull()
  })
})
```

### 7.6 CI Test Configuration

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check       # tsc --noEmit
      - run: npm run lint              # eslint
      - run: npm run format:check     # prettier --check

  test:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration
      - uses: codecov/codecov-action@v4

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 8. Google Services Integration

### 8.1 Firebase Authentication

```typescript
// src/lib/firebase/client.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // GA4
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
```

```typescript
// src/components/auth/GoogleSignInButton.tsx
'use client'

import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase/client'
import { useRouter } from 'next/navigation'

export function GoogleSignInButton() {
  const router = useRouter()

  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      // Set session cookie via API route
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Google sign-in failed', error)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleGoogleSignIn()}
      className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium hover:bg-muted"
      aria-label="Sign in with your Google account"
    >
      {/* Google SVG icon */}
      Sign in with Google
    </button>
  )
}
```

### 8.2 Cloud Firestore — Data Helpers

```typescript
// src/lib/firebase/firestore.ts
import 'server-only'
import { adminDb } from './admin'
import type { FootprintResult } from '@/types/carbon'
import type { UserProfile } from '@/types/user'

export async function saveFootprintRecord(uid: string, data: FootprintResult): Promise<string> {
  const ref = adminDb
    .collection('footprints')
    .doc(uid)
    .collection('records')
    .doc()

  await ref.set({
    ...data,
    createdAt: new Date().toISOString(),
    uid,
  })

  return ref.id
}

export async function getFootprintHistory(uid: string, limit = 12): Promise<FootprintResult[]> {
  const snapshot = await adminDb
    .collection('footprints')
    .doc(uid)
    .collection('records')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map((doc) => doc.data() as FootprintResult)
}
```

### 8.3 Google Analytics 4 (GA4)

```typescript
// src/lib/analytics/events.ts
// Typed event catalogue — enforces consistent tracking

export const ANALYTICS_EVENTS = {
  // Calculator flow
  QUESTIONNAIRE_STARTED: 'questionnaire_started',
  QUESTIONNAIRE_STEP_COMPLETED: 'questionnaire_step_completed',
  QUESTIONNAIRE_COMPLETED: 'questionnaire_completed',
  FOOTPRINT_CALCULATED: 'footprint_calculated',

  // AI features
  AI_RECOMMENDATIONS_REQUESTED: 'ai_recommendations_requested',
  AI_RECOMMENDATIONS_RECEIVED: 'ai_recommendations_received',

  // Auth
  SIGN_UP_COMPLETED: 'sign_up_completed',
  SIGN_IN_GOOGLE: 'sign_in_google',
  SIGN_IN_EMAIL: 'sign_in_email',

  // Goals
  GOAL_CREATED: 'goal_created',
  GOAL_COMPLETED: 'goal_completed',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

export interface FootprintCalculatedParams {
  total_emissions: number
  transport_emissions: number
  diet_emissions: number
  energy_emissions: number
  flights_emissions: number
  transport_choice: string
  diet_choice: string
  energy_choice: string
  flights_choice: string
}
```

```typescript
// src/lib/analytics/gtag.ts
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params)
  }
}
```

### 8.4 Google Cloud Storage — Profile Images

```typescript
// src/lib/storage/upload.ts
import 'server-only'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS ?? '{}') as object,
})

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET ?? '')

export async function uploadProfileImage(uid: string, buffer: Buffer, mimeType: string): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(mimeType)) {
    throw new Error('Invalid image type')
  }

  const maxSizeBytes = 2 * 1024 * 1024 // 2MB
  if (buffer.byteLength > maxSizeBytes) {
    throw new Error('Image too large')
  }

  const fileName = `profiles/${uid}/avatar.${mimeType.split('/')[1]}`
  const file = bucket.file(fileName)

  await file.save(buffer, {
    contentType: mimeType,
    metadata: { cacheControl: 'public, max-age=3600' },
  })

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`
}
```

---

## 9. AI Integration — Gemini API

### 9.1 Client Initialisation

```typescript
// src/lib/gemini/client.ts
import 'server-only' // Gemini calls ONLY from server
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GEMINI_SAFETY_SETTINGS } from './safety'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required but not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export function getGeminiModel(modelName: 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({
    model: modelName,
    safetySettings: GEMINI_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  })
}
```

### 9.2 System Prompt Architecture

```typescript
// src/lib/gemini/prompts.ts
import type { FootprintResult } from '@/types/carbon'
import type { UserAnswers } from '@/types/carbon'

const SYSTEM_CONTEXT = `You are a world-class sustainability advisor specialising in individual carbon footprint reduction. Your recommendations are:
- Evidence-based, citing real reduction potential in tonnes of CO₂e
- Practical and immediately actionable — not vague lifestyle advice
- Calibrated to the user's specific lifestyle profile — never generic
- Encouraging and empowering in tone — never guilt-inducing
- Honest about difficulty level without being discouraging

You must always respond with valid JSON matching the schema provided. Do not include markdown code fences, preamble, or any text outside the JSON object.`

export function buildRecommendationPrompt(answers: UserAnswers, result: FootprintResult): string {
  return `${SYSTEM_CONTEXT}

USER CARBON PROFILE:
- Transport: ${answers.transport} → ${result.transport.toFixed(1)} t CO₂e/yr
- Diet: ${answers.diet} → ${result.diet.toFixed(1)} t CO₂e/yr  
- Home energy: ${answers.energy} → ${result.energy.toFixed(1)} t CO₂e/yr
- Air travel: ${answers.flights} → ${result.flights.toFixed(1)} t CO₂e/yr
- Consumer goods: ${result.goods.toFixed(1)} t CO₂e/yr (lifestyle baseline)
- TOTAL: ${result.total.toFixed(1)} t CO₂e/yr

REFERENCE BENCHMARKS:
- World average: 4.0 t CO₂e/yr
- US average: 16.0 t CO₂e/yr
- Paris Agreement 2050 target: 2.0 t CO₂e/yr
- Gap to target: ${Math.max(0, result.total - 2).toFixed(1)} t CO₂e/yr

TASK: Generate exactly 3 personalised reduction recommendations. Focus on the two highest-emission categories first. Make each recommendation specific to this user's actual choices — reference their transport mode, diet type, or energy source by name.

REQUIRED JSON SCHEMA:
{
  "recommendations": [
    {
      "title": "string — concise action title (max 8 words)",
      "detail": "string — 2–3 sentences: what to do, why it matters for this person specifically, and one concrete next step",
      "saving": "string — estimated annual saving, e.g. '~1.8t CO₂e/yr'",
      "difficulty": "Easy | Medium | Committed",
      "category": "transport | diet | energy | flights | goods",
      "timeframe": "string — e.g. 'Immediate', 'Within 1 month', 'Within 6 months'"
    }
  ]
}`
}

export function buildChatSystemPrompt(result: FootprintResult): string {
  return `${SYSTEM_CONTEXT}

You are in a follow-up conversation with a user whose footprint is ${result.total.toFixed(1)} t CO₂e/yr.
Their category breakdown: Transport ${result.transport.toFixed(1)}t, Diet ${result.diet.toFixed(1)}t, Energy ${result.energy.toFixed(1)}t, Flights ${result.flights.toFixed(1)}t, Goods ${result.goods.toFixed(1)}t.

Answer their questions about sustainability and carbon reduction concisely and helpfully.
Keep responses under 150 words unless detailed explanation is explicitly requested.
Always refer back to their specific profile when relevant.`
}
```

### 9.3 Recommendations API Route (Server-Side Only)

```typescript
// src/app/api/ai/recommendations/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { checkRateLimit } from '@/lib/rate-limit'
import { getGeminiModel } from '@/lib/gemini/client'
import { buildRecommendationPrompt } from '@/lib/gemini/prompts'
import { calculateFootprint } from '@/lib/carbon/calculator'
import { footprintInputSchema } from '@/schemas/footprint.schema'
import { recommendationResponseSchema } from '@/schemas/gemini.schema'
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics/gtag'

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const uid = await requireAuth(request)

  // 2. Rate limit (per user UID)
  await checkRateLimit(`ai-recommendations:${uid}`)

  // 3. Validate input
  const body: unknown = await request.json()
  const parsed = footprintInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // 4. Calculate footprint
  const footprintResult = calculateFootprint(parsed.data)

  // 5. Build prompt
  const prompt = buildRecommendationPrompt(parsed.data, footprintResult)

  // 6. Call Gemini (server-side — key never leaves server)
  const model = getGeminiModel('gemini-2.0-flash')

  try {
    const response = await model.generateContent(prompt)
    const text = response.response.text()

    // 7. Validate Gemini response structure
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch?.[0]) {
      throw new Error('No valid JSON in Gemini response')
    }

    const geminiParsed = recommendationResponseSchema.safeParse(JSON.parse(jsonMatch[0]))
    if (!geminiParsed.success) {
      throw new Error('Gemini response did not match expected schema')
    }

    return NextResponse.json({
      recommendations: geminiParsed.data.recommendations,
      footprint: footprintResult,
    })

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 503 }
    )
  }
}
```

### 9.4 Streaming Chat Route

```typescript
// src/app/api/ai/chat/route.ts
import { type NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { checkRateLimit } from '@/lib/rate-limit'
import { getGeminiModel } from '@/lib/gemini/client'
import { buildChatSystemPrompt } from '@/lib/gemini/prompts'
import { sanitiseForPrompt } from '@/lib/gemini/safety'
import { chatInputSchema } from '@/schemas/gemini.schema'

export async function POST(request: NextRequest) {
  const uid = await requireAuth(request)
  await checkRateLimit(`ai-chat:${uid}`)

  const body: unknown = await request.json()
  const parsed = chatInputSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }

  const { message, footprintContext } = parsed.data
  const sanitisedMessage = sanitiseForPrompt(message)

  const model = getGeminiModel('gemini-2.0-flash')
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: buildChatSystemPrompt(footprintContext) }],
      },
    ],
  })

  const result = await chat.sendMessageStream(sanitisedMessage)

  // Return as ReadableStream for Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of result.stream) {
        const text = chunk.text()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
```

---

## 10. API Design & Contracts

### 10.1 Endpoint Reference

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/footprint/calculate` | Required | 60/min | Calculate and save footprint |
| `GET` | `/api/footprint/history` | Required | 30/min | Fetch user's footprint history |
| `POST` | `/api/ai/recommendations` | Required | 10/min | Gemini recommendations |
| `POST` | `/api/ai/chat` | Required | 20/min | Streaming Gemini chat |
| `GET` | `/api/goals` | Required | 30/min | List user goals |
| `POST` | `/api/goals` | Required | 20/min | Create a goal |
| `PATCH` | `/api/goals/:id` | Required | 20/min | Update a goal |
| `DELETE` | `/api/goals/:id` | Required | 20/min | Delete a goal |
| `GET` | `/api/user` | Required | 30/min | Get user profile |
| `PATCH` | `/api/user` | Required | 10/min | Update user profile |

### 10.2 Standard Error Response Shape

```typescript
// All API errors follow this shape
interface ApiError {
  error: string           // Human-readable message
  code?: string           // Machine-readable code (e.g. 'RATE_LIMIT_EXCEEDED')
  issues?: unknown        // Zod validation issues (only on 400)
}

// HTTP status codes used
// 200 — Success
// 201 — Created
// 400 — Bad Request (validation failure)
// 401 — Unauthorised (no valid token)
// 403 — Forbidden (valid token, insufficient permissions)
// 404 — Not Found
// 429 — Too Many Requests (rate limit)
// 503 — Service Unavailable (Gemini/external service error)
```

---

## 11. Performance Standards

| Metric | Target | Tool |
|---|---|---|
| Lighthouse Performance | ≥ 90 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 95 | Lighthouse CI |
| Lighthouse Best Practices | ≥ 90 | Lighthouse CI |
| Lighthouse SEO | ≥ 90 | Lighthouse CI |
| Largest Contentful Paint (LCP) | < 2.5s | Core Web Vitals |
| First Input Delay (FID) / INP | < 200ms | Core Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Core Web Vitals |
| Total Bundle Size (gzipped) | < 200 kB (initial JS) | Bundle Analyzer |
| API Response Time (p95) | < 500ms (non-AI) | Vercel Analytics |
| Gemini Response Time (p95) | < 5s | Custom monitoring |

**Strategies:**
- Dynamic imports for heavy components (charts, AI chat)
- Next.js Image Optimisation for all images
- Skeleton screens during data fetch — no layout shift
- Server Components for all data-fetching UI — zero client-side waterfall
- Edge runtime for auth middleware

---

## 12. Deployment & Infrastructure

### 12.1 Environments

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Development | `*` (local) | `localhost:3000` | Local development |
| Preview | Any PR branch | `carbontrack-git-*.vercel.app` | PR review and QA |
| Staging | `develop` | `staging.carbontrack.app` | Pre-production validation |
| Production | `main` | `carbontrack.app` | Live users |

### 12.2 CI/CD Pipeline

```
Developer pushes branch
        ↓
GitHub Actions: lint + type-check + unit tests
        ↓ (pass)
Vercel: Deploy preview environment
        ↓
Reviewer: Test on preview URL
        ↓
GitHub Actions: Integration tests + E2E tests
        ↓ (pass)
Merge to main
        ↓
Vercel: Deploy to production (zero-downtime)
        ↓
GitHub Actions: Post-deploy smoke tests
        ↓
Sentry: Monitor for new errors
```

### 12.3 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1", "cdg1"],
  "functions": {
    "src/app/api/ai/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## 13. Development Workflow

### 13.1 Branch Strategy

```
main          ← Production. Protected. Requires PR + passing CI.
  └── develop ← Integration branch. Feature branches merge here.
        ├── feature/gemini-chat-interface
        ├── feature/goal-tracking-dashboard
        ├── fix/calculator-aria-labels
        └── chore/upgrade-nextjs-14-4
```

### 13.2 Pull Request Checklist

Before opening a PR, the author confirms:

- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run test` passes with no regressions
- [ ] New code has tests (unit or integration, as appropriate)
- [ ] All interactive components have `aria-*` attributes and keyboard support
- [ ] No `any` types introduced
- [ ] No secrets or API keys committed
- [ ] Storybook story added for any new UI component
- [ ] Lighthouse score not degraded (run locally if UI changed)

### 13.3 Local Setup

```bash
# Clone and install
git clone https://github.com/org/carbontrack.git
cd carbontrack
npm ci

# Environment setup (copy from .env.local.example and fill in values)
cp .env.local.example .env.local

# Start development server
npm run dev

# Run all tests
npm run test

# Run E2E tests (requires built app)
npm run build && npm run test:e2e

# Storybook
npm run storybook
```

---

## 14. Environment Variables Reference

```bash
# .env.local.example

# ──────────────────────────────────────────────
# Firebase (Client-side — public)
# ──────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=    # GA4 Measurement ID (G-XXXXXXXXXX)

# ──────────────────────────────────────────────
# Firebase Admin (Server-side — NEVER expose to client)
# ──────────────────────────────────────────────
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=             # Keep newlines: "-----BEGIN PRIVATE KEY-----\n..."

# ──────────────────────────────────────────────
# Google Gemini (Server-side — NEVER expose to client)
# ──────────────────────────────────────────────
GEMINI_API_KEY=                         # From Google AI Studio

# ──────────────────────────────────────────────
# Google Cloud (Server-side)
# ──────────────────────────────────────────────
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_CREDENTIALS=              # JSON string of service account key
GOOGLE_CLOUD_STORAGE_BUCKET=

# ──────────────────────────────────────────────
# Rate Limiting (Server-side)
# ──────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ──────────────────────────────────────────────
# Email (Server-side)
# ──────────────────────────────────────────────
RESEND_API_KEY=

# ──────────────────────────────────────────────
# Error Monitoring (Public)
# ──────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=

# ──────────────────────────────────────────────
# App
# ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> **Security rule:** Any variable without `NEXT_PUBLIC_` prefix is **server-only** and must never be referenced in client component files. ESLint rules enforce this.

---

## 15. Acceptance Criteria

### 15.1 Launch Criteria (All must pass before production deploy)

- [ ] All unit and integration tests passing — zero failures
- [ ] E2E tests passing on Chromium, Firefox, and WebKit
- [ ] Lighthouse score ≥ 90 on all four categories (tested on production build)
- [ ] Zero WCAG 2.1 AA violations (tested with axe-core automated scan)
- [ ] Keyboard-only navigation completes all core flows
- [ ] Screen reader tested on VoiceOver (macOS) and NVDA (Windows)
- [ ] Gemini API key confirmed server-side only (no key in client bundle)
- [ ] Firestore Security Rules deployed and validated
- [ ] All rate limits tested and enforced
- [ ] CSP headers verified with no console violations on production build
- [ ] GA4 events firing correctly for core funnel (questionnaire → result → sign-up)
- [ ] Error monitoring (Sentry) configured and receiving events
- [ ] `.env.local.example` up to date; no secrets in git history

### 15.2 Definition of Done (per feature)

A feature is complete when:
1. Implementation matches the design specification
2. TypeScript compiles with `strict: true`, zero errors
3. ESLint passes with zero warnings
4. Tests written and passing (≥80% coverage for new code)
5. Accessibility audit clean (axe DevTools browser extension)
6. Storybook story added (for new components)
7. PR reviewed and approved by at least one other engineer
8. All CI checks green

---

*End of Engineering Specification*

*This document should be treated as a living specification — update it as architectural decisions evolve. All changes must be reviewed via PR against the `docs/` directory.*
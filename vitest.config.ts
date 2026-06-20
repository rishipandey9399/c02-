import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    server: {
      deps: {
        inline: ['@upstash/redis', '@upstash/ratelimit', 'firebase-admin', 'next'],
      },
    },
    coverage: {
      include: [
        'src/lib/auth/session.ts',
        'src/lib/carbon/**',
        'src/lib/rate-limit.ts',
        'src/lib/gemini/prompts.ts',
        'src/lib/gemini/safety.ts',
        'src/schemas/**',
        'src/app/api/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@/components/auth/AuthGuard': path.resolve(__dirname, './tests/mocks/auth-guard.tsx'),
      '@/components/shared/AppShell': path.resolve(__dirname, './tests/mocks/app-shell.tsx'),
      '@/lib/firebase/client': path.resolve(__dirname, './tests/mocks/firebase-client.ts'),
      '@/lib/firebase/admin': path.resolve(__dirname, './tests/mocks/firebase-admin.ts'),
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './tests/mocks/server-only.ts'),
      '@upstash/redis': path.resolve(__dirname, './tests/mocks/upstash-redis.ts'),
      '@upstash/ratelimit': path.resolve(__dirname, './tests/mocks/upstash-ratelimit.ts'),
      'firebase-admin': path.resolve(__dirname, './tests/mocks/firebase-admin.ts'),
      'next/navigation': path.resolve(__dirname, './tests/mocks/next-navigation.ts'),
      'next/headers': path.resolve(__dirname, './tests/mocks/next-headers.ts'),
      'next/server': path.resolve(__dirname, './tests/mocks/next-server.ts'),
    },
  },
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    jsxInject: `import React from 'react'`,
  },
})

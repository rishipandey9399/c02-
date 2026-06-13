import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
  title: 'CarbonTrack - Personal Carbon Footprint Tracker',
  description: 'Track, analyze, and reduce your carbon footprint with personalized AI recommendations and real-time tracking.',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-border shadow-md"
        >
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1} className="min-h-screen flex flex-col">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}


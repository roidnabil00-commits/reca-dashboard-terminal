import type { Metadata, Viewport } from 'next'
import './globals.css'
// Using local system fonts to avoid Google Fonts network dependency
const inter = { variable: '--font-inter' }
const playfair = { variable: '--font-playfair' }
const jetbrains = { variable: '--font-jetbrains' }

export const metadata: Metadata = {
  title: 'Reca Intelligence Terminal',
  description: 'Private Market Intelligence Platform — RECA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Reca Intel',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Reca Intel',
    'msapplication-TileColor': '#0f2044',
    'theme-color': '#0f2044',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f2044',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* iOS Safari PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Reca Intel" />
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        {/* Splash screens (optional) */}
        <meta name="msapplication-TileColor" content="#0f2044" />
        <meta name="theme-color" content="#0f2044" />
      </head>
      <body className="font-sans bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}

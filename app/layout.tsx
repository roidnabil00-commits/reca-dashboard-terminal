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
  
  // 1. TAMBAHKAN INI UNTUK FAVICON
  icons: {
    icon: '/icons/icon-192x192.png', // Atau arahkan ke '/favicon.ico' jika ada di folder public
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },

  // 2. TAMBAHKAN INI UNTUK OPEN GRAPH (WhatsApp, Facebook, LinkedIn)
  openGraph: {
    title: 'Reca Intelligence Terminal',
    description: 'Private Market Intelligence Platform — RECA',
    url: 'https://domain-reca-anda.com', // Ganti dengan URL asli website Anda
    siteName: 'Reca Intel',
    images: [
      {
        url: '/og-image.jpg', // Siapkan gambar banner ukuran 1200x630px dan taruh di folder public/
        width: 1200,
        height: 630,
        alt: 'Reca Intelligence Terminal Banner',
      },
    ],
    locale: 'id_ID', // atau en_US
    type: 'website',
  },

  // 3. TAMBAHKAN INI UNTUK TWITTER/X
  twitter: {
    card: 'summary_large_image',
    title: 'Reca Intelligence Terminal',
    description: 'Private Market Intelligence Platform — RECA',
    images: ['/og-image.jpg'], // Gunakan gambar banner yang sama
  },

  // (Kode Anda yang sudah ada di bawah ini tetap dipertahankan)
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

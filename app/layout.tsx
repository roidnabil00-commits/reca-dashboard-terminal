import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = { variable: '--font-inter' }
const playfair = { variable: '--font-playfair' }
const jetbrains = { variable: '--font-jetbrains' }

export const metadata: Metadata = {
  metadataBase: new URL('https://www.recaintel.id'),
  title: 'Reca Intelligence Terminal',
  description: 'Private Market Intelligence Platform RECA',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/icons/icon-192x192.png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152' },
      { url: '/icons/icon-192x192.png', sizes: '180x180' },
      { url: '/icons/icon-192x192.png', sizes: '167x167' },
    ],
  },
  openGraph: {
    title: 'Reca Intelligence Terminal',
    description: 'Private Market Intelligence Platform RECA',
    url: 'https://www.recaintel.id',
    siteName: 'Reca Intel',
    images: [
      {
        url: '/abilreca.jpeg',
        width: 1200,
        height: 630,
        alt: 'Reca Intelligence Terminal Banner',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reca Intelligence Terminal',
    description: 'Private Market Intelligence Platform RECA',
    images: ['/abilreca.jpeg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Reca Intel',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0f2044',
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
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import { EnvironmentBadge } from '@/components/environment-badge'
import {
  joinCitiesForDisplay,
  SERVICE_CITIES,
  SITE_EMAIL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })

const cityList = joinCitiesForDisplay(SERVICE_CITIES)

const title = 'Permanent Roofline LED Lighting in Edmonton & Area | Verie Gudt'
const description = `Verie Gudt installs premium, app-controlled permanent roofline LED lighting for homes in ${cityList}. Millions of colors and scenes for every season. Get a free quote.`
const ogDescription = `Premium app-controlled permanent LED roofline lighting installed by local pros serving ${cityList}. One system for every season.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  generator: 'v0.app',
  keywords: [
    'permanent roofline lighting',
    'LED home lighting',
    'permanent holiday lights',
    'Verie Gudt Home Services',
    'app controlled house lights',
    'permanent roofline lighting Edmonton',
    'permanent holiday lights Sherwood Park',
    'LED roofline lighting St. Albert',
    'permanent lighting installer Leduc',
  ],
  icons: {
    icon: SITE_LOGO_URL,
    shortcut: SITE_LOGO_URL,
    apple: SITE_LOGO_URL,
  },
  openGraph: {
    title,
    description: ogDescription,
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: SITE_LOGO_URL,
        alt: 'Verie Gudt Home Services logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: ogDescription,
    images: [SITE_LOGO_URL],
  },
}

// LocalBusiness structured data, site-wide. No street address — this is a service-area business
// with no public storefront, and Google's own guidance for SABs is to declare areaServed rather
// than a fabricated or residential address.
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: SITE_NAME,
  description,
  url: SITE_URL,
  telephone: SITE_PHONE,
  email: SITE_EMAIL,
  image: SITE_LOGO_URL,
  areaServed: SERVICE_CITIES.map((city) => ({
    '@type': 'City',
    name: city,
    address: { '@type': 'PostalAddress', addressRegion: 'AB', addressCountry: 'CA' },
  })),
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12141c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} bg-background`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        <EnvironmentBadge />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

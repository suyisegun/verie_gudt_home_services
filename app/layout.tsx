import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import { EnvironmentBadge } from '@/components/environment-badge'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })

export const metadata: Metadata = {
  title: 'Verie Gudt Home Services | Permanent Roofline LED Lighting',
  description:
    'Verie Gudt installs premium, app-controlled permanent roofline LED lighting for your home. Millions of colors and scenes for holidays, game days, and everyday ambiance. Get a free quote.',
  generator: 'v0.app',
  keywords: [
    'permanent roofline lighting',
    'LED home lighting',
    'permanent holiday lights',
    'Verie Gudt Home Services',
    'app controlled house lights',
  ],
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png',
  },
  openGraph: {
    title: 'Verie Gudt Home Services | Permanent Roofline LED Lighting',
    description:
      'Premium app-controlled permanent LED roofline lighting installed by local pros. One system for every season.',
    type: 'website',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VGHMlogo-R3UA1mAtU9EJASOrjAHbjEKckfoXP9.png',
        alt: 'Verie Gudt Home Services logo',
      },
    ],
  },
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
        {children}
        <EnvironmentBadge />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '14-Day MVP Development | myMVP - Production Ready Web Apps',
  description: 'Get a working MVP with payments and user accounts in 14 days. Next.js web applications built for validation, not perfection. Live in 14 days.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://mymvp.io'),
  openGraph: {
    title: '14-Day MVP Development | myMVP - Production Ready Web Apps',
    description: 'Get a working MVP with payments and user accounts in 14 days. Next.js web applications built for validation, not perfection. Live in 14 days.',
    images: ['/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '14-Day MVP Development | myMVP - Production Ready Web Apps',
    description: 'Get a working MVP with payments and user accounts in 14 days. Next.js web applications built for validation, not perfection. Live in 14 days.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyMVP - AI-Powered MVP Development Platform',
  description: 'Transform your vision into a production-ready application in 14 days with AI-accelerated development systems.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://mymvp.io'),
  openGraph: {
    title: 'MyMVP - AI-Powered MVP Development',
    description: 'Skip the guesswork. Our AI-powered chat defines precise requirements for your MVP in minutes, not weeks.',
    images: ['/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyMVP - AI-Powered MVP Development',
    description: 'Skip the guesswork. Our AI-powered chat defines precise requirements for your MVP in minutes, not weeks.',
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
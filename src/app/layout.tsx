import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyMVP - AI-Powered MVP Development Platform',
  description: 'Transform your vision into a production-ready application in 14 days with AI-accelerated development systems.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
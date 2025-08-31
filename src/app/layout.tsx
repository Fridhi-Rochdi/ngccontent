import '../styles/globals.css'
import './responsive.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { AppStateProvider } from '@/contexts/AppStateContext'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Athena - AI-Powered Learning Platform',
  description: 'Professional learning platform with AI-generated content for senior engineers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider>
            <AppStateProvider>
              {children}
            </AppStateProvider>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

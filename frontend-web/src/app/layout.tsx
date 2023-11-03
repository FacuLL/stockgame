'use client';

import DefaultNavbar from '@/components/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from './AuthContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stockgame'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <DefaultNavbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}

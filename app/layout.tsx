import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DataNest - Your Personal Code Snippet Vault',
  description: 'AI-powered code snippet manager built with Next.js and shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

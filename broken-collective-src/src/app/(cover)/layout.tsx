import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { BASE_PATH, ORIGIN, abs } from '@/lib/book'
import { t } from '@/lib/i18n'
import { THEME_SCRIPT } from '@/lib/theme-script'

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: `${t('en', 'book.title')} · ${t('he', 'book.title')}`,
  description: t('en', 'meta.description'),
  alternates: { canonical: abs('/'), languages: { he: abs('/he/'), en: abs('/en/') } },
  openGraph: { type: 'book', images: [abs('/og.png')] },
  twitter: { card: 'summary_large_image', images: [abs('/og.png')] },
  icons: { icon: `${BASE_PATH}/favicon.svg`, apple: `${BASE_PATH}/apple-touch-icon.png` },
}

export const viewport: Viewport = { themeColor: '#f2eadb' }

export default function CoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

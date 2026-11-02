import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import { BASE_PATH, LANGS, ORIGIN, abs, dirOf, isLang } from '@/lib/book'
import { t } from '@/lib/i18n'
import { THEME_SCRIPT } from '@/lib/theme-script'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return {
    metadataBase: new URL(ORIGIN),
    title: { default: `${t(lang, 'book.title')} · ${t(lang, 'book.author')}`, template: `%s · ${t(lang, 'book.title')}` },
    description: t(lang, 'meta.description'),
    openGraph: {
      type: 'book',
      siteName: t(lang, 'book.title'),
      locale: lang === 'he' ? 'he_IL' : 'en_US',
      images: [abs('/og.png')],
    },
    twitter: { card: 'summary_large_image', images: [abs('/og.png')] },
    icons: { icon: `${BASE_PATH}/favicon.svg` },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2eadb' },
    { media: '(prefers-color-scheme: dark)', color: '#131116' },
  ],
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return (
    <html lang={lang} dir={dirOf(lang)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}

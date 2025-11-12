import { LingoProvider, loadDictionary } from 'lingo.dev/react/rsc'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Pocket Senpai - Your Expert Senior Colleague',
  description:
    'Your knowledgeable senior colleague in your pocket. Get instant answers to any work question in your native language - from machinery to procedures to troubleshooting.',
  generator: 'Pocket Senpai Terminal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LingoProvider loadDictionary={locale => loadDictionary(locale)}>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        </head>
        <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                          console.log('SW registered: ', registration);
                        })
                        .catch(function(registrationError) {
                          console.log('SW registration failed: ', registrationError);
                        });
                    });
                  }
                `,
              }}
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </LingoProvider>
  )
}

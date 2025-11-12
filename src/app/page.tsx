'use client'

import { LocaleSwitcher } from 'lingo.dev/react/client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & { MSStream?: unknown }).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
    }
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        Install App
      </button>
      {isIOS && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {' '}
              ⎋{' '}
            </span>
            and then &ldquo;Add to Home Screen&rdquo;
            <span role="img" aria-label="plus icon">
              {' '}
              ➕{' '}
            </span>
            .
          </p>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <InstallPrompt />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col w-full">
          <LocaleSwitcher locales={['en', 'es', 'fr', 'de', 'ja', 'zh']} />
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-purple-500 dark:border-purple-400 transition-colors flex items-center justify-center bg-purple-500 text-white hover:bg-purple-600 dark:hover:bg-purple-500 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/chat"
          >
            Memory Chat
          </a>
          <a
            className="rounded-full border border-solid border-blue-500 dark:border-blue-400 transition-colors flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/memories"
          >
            Add Memories
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}

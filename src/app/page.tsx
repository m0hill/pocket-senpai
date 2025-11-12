'use client'

import { LocaleSwitcher } from 'lingo.dev/react/client'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  MessageSquare,
  Moon,
  Shield,
  Sun,
  Upload,
  Zap,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & { MSStream?: unknown }).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
    }
  }, [])

  if (isStandalone) {
    return null
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowIOSHint(!showIOSHint)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-border hover:bg-muted text-foreground transition-colors font-mono text-xs sm:text-sm"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">[INSTALL_APP]</span>
        <span className="sm:hidden">[INSTALL]</span>
      </button>
      {isIOS && showIOSHint && (
        <div className="absolute top-full right-0 mt-2 p-3 sm:p-4 bg-card border border-border shadow-lg max-w-xs z-10 text-xs">
          <p className="text-muted-foreground">
            To install: Tap share button and select &quot;Add to Home Screen&quot;
          </p>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen font-mono text-xs sm:text-sm">
      <div className="bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">{'>'}</span>
                <span className="font-bold text-base sm:text-lg">POCKET_SENPAI_v1.0</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <InstallPrompt />
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-border hover:bg-muted transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span className="hidden sm:inline">
                      {theme === 'dark' ? '[LIGHT]' : '[DARK]'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="border border-border mb-6 sm:mb-8">
              <div className="bg-muted p-3 sm:p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-bold text-sm sm:text-base">EXPERT_SENPAI.SYS</span>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Your Expert Senior Colleague
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  Like having a knowledgeable senior coworker who&apos;s always available. Ask
                  anything about your work in your native language - from machinery questions to
                  procedures to troubleshooting.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold border border-border hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">[ASK_QUESTION]</span>
                  </Link>
                  <Link
                    href="/memories"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border border-border hover:bg-muted transition-colors"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">[UPLOAD_MANUAL]</span>
                  </Link>
                </div>

                <div className="flex justify-center sm:justify-start">
                  <LocaleSwitcher locales={['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi', 'tl']} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem/Solution Section */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-12">
              <div className="border border-border">
                <div className="bg-muted p-2 sm:p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-bold text-sm">PROBLEMS.LOG</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-destructive mt-0.5">{'>'}</span>
                      <span>Complex machinery manuals only available in technical Japanese</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-destructive mt-0.5">{'>'}</span>
                      <span>No time to translate during emergency situations</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-destructive mt-0.5">{'>'}</span>
                      <span>Safety risks when you can&apos;t understand critical instructions</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-destructive mt-0.5">{'>'}</span>
                      <span>Language barrier affects your confidence and productivity</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border border-border">
                <div className="bg-muted p-2 sm:p-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="font-bold text-sm">SOLUTIONS.LOG</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-500 mt-0.5">{'>'}</span>
                      <span>
                        Ask questions in Vietnamese, Tagalog, English, or your native language
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-500 mt-0.5">{'>'}</span>
                      <span>Get instant, clear answers to any work question in seconds</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-500 mt-0.5">{'>'}</span>
                      <span>Upload machinery manuals and documents for reference</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-500 mt-0.5">{'>'}</span>
                      <span>Available 24/7 on your phone - like having an expert colleague</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">EXAMPLE_QUERIES.DAT</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get immediate answers to any work-related questions
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                <div className="border border-border">
                  <div className="bg-muted p-2 sm:p-3 border-b border-destructive/50">
                    <h3 className="font-bold text-sm">EMERGENCY</h3>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                    <p className="text-muted-foreground">
                      {'>'} &quot;What do I do if the machine is overheating?&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;Emergency stop button not working, help!&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;Machine making strange noises, is it safe?&quot;
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="bg-muted p-2 sm:p-3 border-b border-yellow-500/50">
                    <h3 className="font-bold text-sm">OPERATIONS</h3>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                    <p className="text-muted-foreground">
                      {'>'} &quot;How do I safely clean this equipment?&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;What safety gear do I need for this task?&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;Step-by-step startup procedure?&quot;
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="bg-muted p-2 sm:p-3 border-b border-primary/50">
                    <h3 className="font-bold text-sm">MAINTENANCE</h3>
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                    <p className="text-muted-foreground">
                      {'>'} &quot;How often should I check the oil level?&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;What does this warning light mean?&quot;
                    </p>
                    <p className="text-muted-foreground">
                      {'>'} &quot;Safe way to replace this part?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">FEATURES.SYS</h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="border border-border">
                  <div className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-sm">MULTI_LANGUAGE</h3>
                    <p className="text-xs text-muted-foreground">
                      Vietnamese, Tagalog, English, Japanese, and more
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-sm">INSTANT_ANSWERS</h3>
                    <p className="text-xs text-muted-foreground">
                      Get expert guidance in seconds, not minutes
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-sm">24/7_AVAILABLE</h3>
                    <p className="text-xs text-muted-foreground">
                      Works on any phone, install as an app
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-sm">EXPERT_KNOWLEDGE</h3>
                    <p className="text-xs text-muted-foreground">
                      Like having a senior colleague who knows everything
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-3xl mx-auto border border-primary">
              <div className="bg-primary text-primary-foreground p-4 sm:p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                  <h2 className="text-xl sm:text-3xl font-bold">YOUR_EXPERT_IS_READY</h2>
                </div>
                <p className="text-sm sm:text-lg mb-6 sm:mb-8 opacity-90">
                  Don&apos;t let language barriers slow you down. Your expert senior colleague is
                  ready to help 24/7.
                </p>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-background text-foreground font-semibold border border-border hover:opacity-90 transition-opacity"
                >
                  <span className="text-sm sm:text-base">[START_NOW]</span>
                  <span className="text-lg sm:text-2xl">{'>'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="text-center text-xs text-muted-foreground">
              <p>POCKET_SENPAI_v1.0 | SAFETY_ASSISTANT_SYSTEM</p>
              <p className="mt-1">{'>'} STATUS: ONLINE | READY_TO_ASSIST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Plus, Sun, Moon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function LLMDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }, [isDarkMode])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a placeholder response. The backend will handle actual responses.",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleFileUpload = (file: File) => {
    const message = `📎 Uploaded file: ${file.name}`
    handleSendMessage(message)
  }

  const handleNewChat = () => {
    setMessages([])
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono text-xs sm:text-sm">
      <header className="border-b border-border bg-muted">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
          {/* Top bar */}
          <div className="p-2 sm:p-3 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">{">"}</span>
              <span className="font-bold text-sm sm:text-base">Pocket Senpai</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-1 text-xs px-2 py-1 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors rounded-none"
                title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span className="hidden sm:inline">{isDarkMode ? "ライト" : "ダーク"}</span>
              </button>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 text-xs px-2 py-1 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors rounded-none"
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">新規チャット</span>
                <span className="sm:hidden">新規</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="font-mono text-xs sm:text-sm space-y-3">
                <div className="text-muted-foreground">
                  <span className="text-primary">{">"}</span> Pocket_Senpai_初期化完了
                </div>
                <div className="text-muted-foreground">
                  ステータス: <span className="text-green-500">準備完了</span>
                </div>
                <div className="mt-6 text-muted-foreground">下のメッセージ入力欄を使って会話を始めましょう...</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <ChatMessage key={message.id} message={message} isLast={idx === messages.length - 1} />
              ))}
              {isLoading && (
                <div className="text-muted-foreground text-xs">
                  <span className="text-primary">{">"}</span> アシスタント_思考中
                  <span className="animate-pulse">...</span>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer with input */}
      <footer className="border-t border-border bg-muted sticky bottom-0">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-3 sm:py-4">
          <ChatInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  )
}


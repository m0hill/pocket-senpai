"use client"

import type React from "react"
import { Mic, Paperclip, Send } from "lucide-react"
import { useRef, useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  isLoading?: boolean
}

export function ChatInput({ onSendMessage, onFileUpload, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    onSendMessage(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const chunks: BlobPart[] = []

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" })
          onSendMessage(`[AUDIO] Voice message sent (${(blob.size / 1024).toFixed(1)}KB)`)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Microphone access denied:", error)
      }
    } else {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 flex gap-1 items-stretch bg-input border border-border px-2 hover:border-orange-500/60 focus-within:border-orange-500 transition-all">
          <span className="text-orange-400 text-xs flex-shrink-0 flex items-center">{">"}</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            disabled={isLoading}
            className="flex-1 bg-transparent outline-none resize-none text-xs max-h-24 text-foreground placeholder:text-muted-foreground font-mono py-2"
            rows={1}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center text-muted-foreground hover:text-blue-400 transition-colors flex-shrink-0 disabled:opacity-50"
            title="ファイルをアップロード"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`flex items-center transition-colors flex-shrink-0 disabled:opacity-50 ${
              isRecording ? "text-red-400 bg-red-500/20" : "text-muted-foreground hover:text-blue-400"
            }`}
            title={isRecording ? "録音を停止" : "録音を開始"}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-8 py-0 px-3 gradient-primary text-black hover:shadow-lg hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1 flex-shrink-0 font-mono font-semibold text-xs border border-orange-500/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">送信</span>
        </button>
      </div>
      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="*/*" />
      <p className="text-xs text-muted-foreground font-mono">shift + enter で改行</p>
    </form>
  )
}


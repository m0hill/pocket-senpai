'use client'

import { useChat } from '@ai-sdk/react'
import { Bot, Home, Image as ImageIcon, Loader2, Moon, Send, Sun, User, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Streamdown } from 'streamdown'
import { ImageWithAnnotations } from '@/components/ImageWithAnnotations'

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImageFiles(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && imageFiles.length === 0) return

    const fileParts = await Promise.all(
      imageFiles.map(async file => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        return {
          type: 'file' as const,
          mediaType: file.type,
          filename: file.name,
          url: dataUrl,
        }
      })
    )

    sendMessage({
      text: input.trim() || 'Here are some images',
      files: fileParts,
    })

    setInput('')
    setImageFiles([])
    setImagePreviews([])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-mono text-xs sm:text-sm">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-bold text-base sm:text-lg">POCKET_SENPAI.CHAT</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your expert colleague - understands images, manuals, and speaks your language
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                href="/"
                className="flex items-center gap-1 px-3 py-2 border border-border hover:bg-muted transition-colors text-xs"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">[HOME]</span>
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-1 px-3 py-2 border border-border hover:bg-muted transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {theme === 'dark' ? '[LIGHT]' : '[DARK]'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          {messages.length === 0 ? (
            <div className="border border-border">
              <div className="bg-muted p-2 sm:p-3 border-b border-border">
                <span className="font-bold text-sm">WELCOME.MSG</span>
              </div>
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <Bot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
                  <h3 className="text-base sm:text-lg font-bold mb-2">
                    Ask Anything About Your Work
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    I can help with machinery, procedures, maintenance, troubleshooting, and any
                    work-related questions
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="border border-destructive/50 p-3 sm:p-4">
                    <h4 className="font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                      <span className="text-destructive">{'>'}</span>
                      EMERGENCY & SAFETY
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      &quot;Machine is overheating, what do I do?&quot;
                    </p>
                  </div>
                  <div className="border border-primary/50 p-3 sm:p-4">
                    <h4 className="font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                      <span className="text-primary">{'>'}</span>
                      MACHINERY & EQUIPMENT
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      &quot;How do I fix this error code on the press?&quot;
                    </p>
                  </div>
                  <div className="border border-green-500/50 p-3 sm:p-4">
                    <h4 className="font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                      <span className="text-green-500">{'>'}</span>
                      MAINTENANCE & REPAIR
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      &quot;What tools do I need to replace this part?&quot;
                    </p>
                  </div>
                  <div className="border border-yellow-500/50 p-3 sm:p-4">
                    <h4 className="font-bold text-xs sm:text-sm mb-2 flex items-center gap-2">
                      <span className="text-yellow-500">{'>'}</span>
                      MANUAL TRANSLATION
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      &quot;What does this Japanese procedure mean?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map(message => (
                <div key={message.id} className="border border-border">
                  <div className="bg-muted p-2 sm:p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      {message.role === 'user' ? (
                        <>
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          <span className="font-bold text-xs sm:text-sm">USER_INPUT</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          <span className="font-bold text-xs sm:text-sm">AI_RESPONSE</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    {/* Render image files */}
                    {message.parts
                      .filter(part => part.type === 'file')
                      .map((part, index) => (
                        <div key={index} className="mb-3">
                          <Image
                            src={part.url}
                            alt={part.filename || 'Uploaded image'}
                            width={300}
                            height={200}
                            className="border border-border"
                          />
                        </div>
                      ))}

                    {/* Render text parts */}
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm">
                      {message.parts
                        .filter(part => part.type === 'text')
                        .map((part, index) => (
                          <Streamdown isAnimating={status === 'streaming'} key={index}>
                            {part.text}
                          </Streamdown>
                        ))}
                    </div>

                    {/* Tool call results with visualizations */}
                    {message.parts
                      .filter(part => part.type.startsWith('tool-'))
                      .map((part, index) => {
                        const toolPart = part as any

                        if (toolPart.state === 'output-available') {
                          const output = toolPart.output

                          if (
                            toolPart.type === 'tool-moondreamDetect' &&
                            output?.visualizationType === 'bounding-boxes'
                          ) {
                            return (
                              <div key={index} className="mt-3 pt-3 border-t border-border">
                                <div className="text-xs font-medium mb-2 text-muted-foreground">
                                  {'>'} Detected {output.count} {output.object}(s)
                                </div>
                                <ImageWithAnnotations
                                  imageUrl={output.imageUrl}
                                  boundingBoxes={output.objects}
                                  objectLabel={output.object}
                                />
                              </div>
                            )
                          }

                          if (
                            toolPart.type === 'tool-moondreamPoint' &&
                            output?.visualizationType === 'points'
                          ) {
                            return (
                              <div key={index} className="mt-3 pt-3 border-t border-border">
                                <div className="text-xs font-medium mb-2 text-muted-foreground">
                                  {'>'} Found {output.count} {output.object}(s)
                                </div>
                                <ImageWithAnnotations
                                  imageUrl={output.imageUrl}
                                  points={output.points}
                                  objectLabel={output.object}
                                />
                              </div>
                            )
                          }

                          return (
                            <div key={index} className="mt-3 pt-3 border-t border-border">
                              <div className="text-xs font-medium mb-2 text-muted-foreground">
                                {'>'} Tool: {toolPart.type.replace('tool-', '')}
                              </div>
                              <pre className="text-xs bg-muted p-2 border border-border overflow-auto">
                                {JSON.stringify(output, null, 2)}
                              </pre>
                            </div>
                          )
                        }

                        if (
                          toolPart.state === 'input-streaming' ||
                          toolPart.state === 'input-available'
                        ) {
                          return (
                            <div key={index} className="mt-3 pt-3 border-t border-border">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Using {toolPart.type.replace('tool-', '')}...
                              </div>
                            </div>
                          )
                        }

                        return null
                      })}
                  </div>
                </div>
              ))}

              {status === 'streaming' && (
                <div className="border border-border">
                  <div className="bg-muted p-2 sm:p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-primary" />
                      <span className="font-bold text-xs sm:text-sm">PROCESSING...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-4xl">
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-3 flex gap-2 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative border border-border">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 font-bold text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== 'ready'}
              className="px-3 py-2 sm:py-3 border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              title="Add image"
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask any work question... I speak your language!"
              disabled={status !== 'ready'}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-w-0"
            />
            <button
              type="submit"
              disabled={status !== 'ready' || (!input.trim() && imageFiles.length === 0)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2 flex-shrink-0"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm">[SEND]</span>
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{'>'} Your Pocket Senpai - Expert colleague at work</span>
            <span
              className={`font-mono ${
                status === 'ready'
                  ? 'text-green-500'
                  : status === 'streaming'
                    ? 'text-yellow-500'
                    : 'text-destructive'
              }`}
            >
              STATUS: {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

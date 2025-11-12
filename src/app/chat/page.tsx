'use client'

import { useChat } from '@ai-sdk/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Streamdown } from 'streamdown'
import { ImageWithAnnotations } from '@/components/ImageWithAnnotations'

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImageFiles(prev => [...prev, ...files])

    // Create previews
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

    // Convert files to FileUIPart format with data URLs
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

    // Send message with files
    sendMessage({
      text: input.trim() || 'Here are some images',
      files: fileParts,
    })

    setInput('')
    setImageFiles([])
    setImagePreviews([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Memory Chat</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chat with AI that remembers your conversations and understands images
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                Your AI assistant has access to all your uploaded memories and can understand images
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    Remember Information
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    &quot;Remember that I prefer morning meetings&quot;
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Analyze Images
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    &quot;What objects are in this image?&quot;
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Recall Context
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    &quot;What did I tell you about my project?&quot;
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-left">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Visual Questions
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    &quot;Describe what you see in this screenshot&quot;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>

                    {/* Render image files */}
                    {message.parts
                      .filter(part => part.type === 'file')
                      .map((part, index) => (
                        <div key={index} className="mb-2">
                          <Image
                            src={part.url}
                            alt={part.filename || 'Uploaded image'}
                            width={300}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                      ))}

                    {/* Render text parts */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
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
                        // Type assertion for tool parts
                        const toolPart = part as any

                        // Check if this is a moondream detect or point tool with output
                        if (toolPart.state === 'output-available') {
                          const output = toolPart.output

                          // Render detect results with bounding boxes
                          if (
                            toolPart.type === 'tool-moondreamDetect' &&
                            output?.visualizationType === 'bounding-boxes'
                          ) {
                            return (
                              <div
                                key={index}
                                className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                              >
                                <div className="text-xs font-medium mb-2 opacity-75">
                                  Detected {output.count} {output.object}(s)
                                </div>
                                <ImageWithAnnotations
                                  imageUrl={output.imageUrl}
                                  boundingBoxes={output.objects}
                                  objectLabel={output.object}
                                />
                              </div>
                            )
                          }

                          // Render point results with points
                          if (
                            toolPart.type === 'tool-moondreamPoint' &&
                            output?.visualizationType === 'points'
                          ) {
                            return (
                              <div
                                key={index}
                                className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                              >
                                <div className="text-xs font-medium mb-2 opacity-75">
                                  Found {output.count} {output.object}(s)
                                </div>
                                <ImageWithAnnotations
                                  imageUrl={output.imageUrl}
                                  points={output.points}
                                  objectLabel={output.object}
                                />
                              </div>
                            )
                          }

                          // Render other tool outputs as JSON
                          return (
                            <div
                              key={index}
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="text-xs font-medium mb-2 opacity-75">
                                Tool: {toolPart.type.replace('tool-', '')}
                              </div>
                              <pre className="text-xs bg-gray-800 text-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(output, null, 2)}
                              </pre>
                            </div>
                          )
                        }

                        // Show loading state for tools being executed
                        if (
                          toolPart.state === 'input-streaming' ||
                          toolPart.state === 'input-available'
                        ) {
                          return (
                            <div
                              key={index}
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="text-xs font-medium mb-2 opacity-75 flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-3 flex gap-2 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    ×
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
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Add image"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything... I'll remember our conversation!"
              disabled={status !== 'ready'}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={status !== 'ready' || (!input.trim() && imageFiles.length === 0)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Powered by Anthropic Claude with Supermemory and Moondream Vision
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Home,
  Link as LinkIcon,
  Moon,
  RefreshCw,
  Sun,
  Upload,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type UploadType = 'text' | 'file' | 'url'

interface Memory {
  id: string
  title: string | null
  summary: string | null
  createdAt: string
  updatedAt: string
  status: string
  type: string
}

interface MemoriesResponse {
  memories: Memory[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    limit: number
  }
}

export default function MemoriesPage() {
  const [uploadType, setUploadType] = useState<UploadType>('text')
  const [content, setContent] = useState('')
  const [containerTag, setContainerTag] = useState('imported')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; status: string; filename?: string } | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  const [memories, setMemories] = useState<Memory[]>([])
  const [loadingMemories, setLoadingMemories] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchMemories = useCallback(
    async (page = 1) => {
      setLoadingMemories(true)
      try {
        const response = await fetch('/api/memories/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            limit: 10,
            page,
            containerTag,
            sort: 'createdAt',
            order: 'desc',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch memories')
        }

        const data = (await response.json()) as MemoriesResponse
        setMemories(data.memories)
        setCurrentPage(data.pagination.currentPage)
        setTotalPages(data.pagination.totalPages)
        setTotalItems(data.pagination.totalItems)
      } catch (err) {
        console.error('Error fetching memories:', err)
      } finally {
        setLoadingMemories(false)
      }
    },
    [containerTag]
  )

  useEffect(() => {
    fetchMemories(1)
  }, [containerTag, fetchMemories])

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          containerTag,
          metadata: {
            uploadedAt: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload memory')
      }

      const data = (await response.json()) as { id: string; status: string }
      setResult(data)
      setContent('')
      fetchMemories(currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    const filename = file.name

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('containerTag', containerTag)

      const response = await fetch('/api/memories/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { details?: string }
        throw new Error(errorData.details || 'Failed to upload file')
      }

      const data = (await response.json()) as { id: string; status: string }
      setResult({ ...data, filename })
      setFile(null)
      fetchMemories(currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (uploadType === 'file') {
      handleFileSubmit(e)
    } else {
      handleTextSubmit(e)
    }
  }

  return (
    <div className="min-h-screen font-mono text-xs sm:text-sm">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-bold text-base sm:text-lg">DOCUMENT_MANAGER.SYS</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add work manuals, procedures, and documents for Pocket Senpai to reference
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                href="/chat"
                className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs"
              >
                <span className="hidden sm:inline">[CHAT]</span>
                <span className="sm:hidden">[C]</span>
              </Link>
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

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Upload Section */}
        <div className="border border-border mb-6 sm:mb-8">
          <div className="bg-muted p-2 sm:p-3 border-b border-border">
            <span className="font-bold text-sm">UPLOAD_NEW_DOCUMENT.FORM</span>
          </div>
          <div className="p-4 sm:p-6">
            {/* Upload Type Tabs */}
            <div className="flex gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setUploadType('text')}
                className={`px-3 sm:px-4 py-2 border transition-colors text-xs sm:text-sm ${
                  uploadType === 'text'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                [TEXT]
              </button>
              <button
                onClick={() => setUploadType('file')}
                className={`px-3 sm:px-4 py-2 border transition-colors text-xs sm:text-sm ${
                  uploadType === 'file'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                [FILE]
              </button>
              <button
                onClick={() => setUploadType('url')}
                className={`px-3 sm:px-4 py-2 border transition-colors text-xs sm:text-sm ${
                  uploadType === 'url'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                [URL]
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {uploadType === 'text' && (
                <div>
                  <label htmlFor="content" className="block text-xs sm:text-sm font-medium mb-2">
                    {'>'} CONTENT:
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={8}
                    className="w-full px-3 sm:px-4 py-2 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm font-mono"
                    placeholder="Enter your content here..."
                    required
                  />
                </div>
              )}

              {uploadType === 'file' && (
                <div>
                  <label htmlFor="file" className="block text-xs sm:text-sm font-medium mb-2">
                    {'>'} FILE:
                  </label>
                  <input
                    id="file"
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 sm:px-4 py-2 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.md,.csv,.doc,.docx"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: PDF, Images, Office docs, Text files
                  </p>
                </div>
              )}

              {uploadType === 'url' && (
                <div>
                  <label htmlFor="url" className="block text-xs sm:text-sm font-medium mb-2">
                    {'>'} URL:
                  </label>
                  <input
                    id="url"
                    type="url"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm font-mono"
                    placeholder="https://example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports web pages, Twitter/X, YouTube, and more
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="containerTag" className="block text-xs sm:text-sm font-medium mb-2">
                  {'>'} CONTAINER_TAG:
                </label>
                <input
                  id="containerTag"
                  type="text"
                  value={containerTag}
                  onChange={e => setContainerTag(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm font-mono"
                  placeholder="pocket-senpai"
                />
                <p className="text-xs text-muted-foreground mt-2">Group related content together</p>
              </div>

              <button
                type="submit"
                disabled={
                  loading || (uploadType === 'file' && !file) || (uploadType !== 'file' && !content)
                }
                className="w-full px-4 sm:px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">[UPLOADING...]</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">[UPLOAD_DOCUMENT]</span>
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className="mt-4 p-3 sm:p-4 border border-green-500 bg-green-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h3 className="font-bold text-sm text-green-500">UPLOAD_SUCCESS</h3>
                </div>
                {result.filename && (
                  <p className="text-xs mb-1">
                    {'>'} File: {result.filename}
                  </p>
                )}
                <p className="text-xs mb-1">
                  {'>'} Status: {result.status.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {'>'} ID: {result.id}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 sm:p-4 border border-destructive bg-destructive/10">
                <h3 className="font-bold text-sm text-destructive mb-2">ERROR</h3>
                <p className="text-xs text-destructive">
                  {'>'} {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Memories List */}
        <div className="border border-border">
          <div className="bg-muted p-2 sm:p-3 border-b border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div>
                <span className="font-bold text-sm">UPLOADED_DOCUMENTS.DB</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {'>'} {totalItems} {totalItems === 1 ? 'document' : 'documents'} available
                </p>
              </div>
              <button
                onClick={() => fetchMemories(currentPage)}
                disabled={loadingMemories}
                className="flex items-center gap-2 px-3 py-1.5 border border-border hover:bg-background transition-colors disabled:opacity-50 text-xs self-end sm:self-auto"
              >
                <RefreshCw className={`w-3 h-3 ${loadingMemories ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">[REFRESH]</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loadingMemories && memories.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground text-sm">LOADING_MEMORIES...</p>
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-8 sm:py-12 border border-border">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold mb-2 text-sm sm:text-base">NO_DOCUMENTS_FOUND</h3>
                <p className="text-xs text-muted-foreground">
                  Upload your first manual or document using the form above
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {memories.map(memory => (
                    <div
                      key={memory.id}
                      className="border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm sm:text-base flex-1">
                            {'>'} {memory.title || 'UNTITLED_MEMORY'}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <span
                              className={`px-2 py-0.5 text-xs border ${
                                memory.status === 'done'
                                  ? 'border-green-500 text-green-500 bg-green-500/10'
                                  : memory.status === 'failed'
                                    ? 'border-destructive text-destructive bg-destructive/10'
                                    : 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                              }`}
                            >
                              {memory.status.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 text-xs border border-primary text-primary bg-primary/10">
                              {memory.type.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {memory.summary && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                            {memory.summary}
                          </p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Created: {new Date(memory.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>Updated: {new Date(memory.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => fetchMemories(currentPage - 1)}
                      disabled={currentPage === 1 || loadingMemories}
                      className="flex items-center gap-1 px-3 py-2 border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">[PREV]</span>
                    </button>
                    <span className="text-xs text-muted-foreground px-3">
                      PAGE {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => fetchMemories(currentPage + 1)}
                      disabled={currentPage === totalPages || loadingMemories}
                      className="flex items-center gap-1 px-3 py-2 border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      <span className="hidden sm:inline">[NEXT]</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 sm:mt-8 border border-border">
          <div className="bg-muted p-2 sm:p-3 border-b border-border">
            <span className="font-bold text-sm">INFO.TXT</span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <span className="text-primary font-bold">{'>'} MANUALS & GUIDES:</span>{' '}
                <span className="text-muted-foreground">
                  Upload machinery manuals, safety procedures, work instructions
                </span>
              </p>
              <p>
                <span className="text-primary font-bold">{'>'} SMART_PROCESSING:</span>{' '}
                <span className="text-muted-foreground">
                  Documents become searchable and referenceable in chat
                </span>
              </p>
              <p>
                <span className="text-primary font-bold">{'>'} MULTI_LANGUAGE:</span>{' '}
                <span className="text-muted-foreground">
                  I can read Japanese documents and answer in your language
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

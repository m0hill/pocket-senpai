'use client'

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
  const [containerTag, setContainerTag] = useState('pocket-senpai')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; status: string; filename?: string } | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  // List memories state
  const [memories, setMemories] = useState<Memory[]>([])
  const [loadingMemories, setLoadingMemories] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch memories
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

  // Load memories on mount and when container tag changes
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
      // Refresh memories list
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
      // Refresh memories list
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
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Add to Supermemory</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload content to your knowledge graph
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/chat"
              className="px-4 py-2 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Chat
            </a>
            <Link
              href="/"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setUploadType('text')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            uploadType === 'text'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setUploadType('file')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            uploadType === 'file'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          File
        </button>
        <button
          onClick={() => setUploadType('url')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            uploadType === 'url'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {uploadType === 'text' && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your content here..."
              required
            />
          </div>
        )}

        {uploadType === 'file' && (
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-2">
              File
            </label>
            <input
              id="file"
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.md,.csv,.doc,.docx"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported: PDF, Images (JPG, PNG, WebP), Office docs (DOCX), Text files (TXT, MD, CSV)
            </p>
          </div>
        )}

        {uploadType === 'url' && (
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports web pages, Twitter/X, YouTube, and more
            </p>
          </div>
        )}

        <div>
          <label htmlFor="containerTag" className="block text-sm font-medium mb-2">
            Container Tag
          </label>
          <input
            id="containerTag"
            type="text"
            value={containerTag}
            onChange={e => setContainerTag(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="pocket-senpai"
          />
          <p className="text-xs text-gray-500 mt-1">Group related content together</p>
        </div>

        <button
          type="submit"
          disabled={
            loading || (uploadType === 'file' && !file) || (uploadType !== 'file' && !content)
          }
          className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload Memory'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            ✓ Successfully Uploaded!
          </h3>
          {result.filename && (
            <p className="text-sm text-green-700 dark:text-green-300 mb-1">
              File: {result.filename}
            </p>
          )}
          <p className="text-sm text-green-700 dark:text-green-300">
            Status: {result.status} - Your memory is being processed
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">ID: {result.id}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error</h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Memories List */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Memories</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalItems} {totalItems === 1 ? 'memory' : 'memories'} uploaded
            </p>
          </div>
          <button
            onClick={() => fetchMemories(currentPage)}
            disabled={loadingMemories}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loadingMemories ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loadingMemories && memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading memories...</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No memories yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload your first memory using the form above
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {memories.map(memory => (
                <div
                  key={memory.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {memory.title || 'Untitled Memory'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            memory.status === 'done'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : memory.status === 'failed'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}
                        >
                          {memory.status}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {memory.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {memory.summary && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {memory.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Created: {new Date(memory.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Updated: {new Date(memory.updatedAt).toLocaleDateString()}</span>
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
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchMemories(currentPage + 1)}
                  disabled={currentPage === totalPages || loadingMemories}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">About Supermemory</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Documents:</strong> Raw content you upload (PDFs, URLs, text)
          </p>
          <p>
            <strong>Memories:</strong> Searchable chunks created automatically with relationships
          </p>
          <p>
            <strong>Container Tags:</strong> Group related content for better context
          </p>
        </div>
      </div>
    </div>
  )
}

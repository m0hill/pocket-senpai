import { NextRequest, NextResponse } from 'next/server'
import Supermemory from 'supermemory'

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      content: string
      containerTag?: string
      metadata?: Record<string, string | number | boolean | string[]>
    }
    const { content, containerTag, metadata } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const result = await client.memories.add({
      content,
      containerTag: containerTag || 'pocket-senpai',
      metadata: metadata || {},
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding memory:', error)
    return NextResponse.json({ error: 'Failed to add memory' }, { status: 500 })
  }
}

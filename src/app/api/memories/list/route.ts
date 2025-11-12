import { NextRequest, NextResponse } from 'next/server'
import Supermemory from 'supermemory'

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      limit?: number
      page?: number
      containerTag?: string
      sort?: 'createdAt' | 'updatedAt'
      order?: 'asc' | 'desc'
    }

    const { limit = 10, page = 1, containerTag, sort = 'createdAt', order = 'desc' } = body

    const result = await client.memories.list({
      limit,
      page,
      containerTags: containerTag ? [containerTag] : undefined,
      sort,
      order,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error listing memories:', error)
    return NextResponse.json({ error: 'Failed to list memories' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const containerTag = formData.get('containerTag') as string

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Create a new FormData for the Supermemory API with proper file handling
    const uploadFormData = new FormData()

    // Convert File to Blob to ensure proper handling
    const blob = new Blob([await file.arrayBuffer()], { type: file.type })
    uploadFormData.append('file', blob, file.name)
    uploadFormData.append('containerTags', containerTag || 'pocket-senpai')

    // Make direct API call to Supermemory with proper file upload
    const response = await fetch('https://api.supermemory.ai/v3/documents/file', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPERMEMORY_API_KEY}`,
      },
      body: uploadFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supermemory API error:', errorText)
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

import { tool } from 'ai'
import { z } from 'zod'

const MOONDREAM_API_BASE = 'https://api.moondream.ai/v1'

interface MoondreamOptions {
  apiKey: string
}

type MoondreamRequestResult<T> = { ok: true; data: T } | { ok: false; error: string }

interface MoondreamRequestOptions<T> {
  endpoint: string
  payload: Record<string, unknown>
  apiKey: string
  label: string
}

async function performMoondreamRequest<T>({
  endpoint,
  payload,
  apiKey,
  label,
}: MoondreamRequestOptions<T>): Promise<MoondreamRequestResult<T>> {
  const startTime = Date.now()
  const url = `${MOONDREAM_API_BASE}/${endpoint}`

  console.log(`[${label}] Starting request:`, {
    url,
    method: 'POST',
    payloadSize: JSON.stringify(payload).length,
    payloadKeys: Object.keys(payload),
    timestamp: new Date().toISOString(),
  })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log(`[${label}] Request timeout after 25s`)
      controller.abort()
    }, 25000) // 25 second timeout

    console.log(`[${label}] Sending fetch request...`)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Moondream-Auth': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    console.log(`[${label}] Response received:`, {
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      const errorText = await response.text()
      const totalTime = Date.now() - startTime
      console.error(`[${label}] API Error:`, {
        status: response.status,
        statusText: response.statusText,
        errorText,
        totalTime: `${totalTime}ms`,
      })
      return { ok: false, error: `Moondream API error (${response.status}): ${errorText}` }
    }

    console.log(`[${label}] Parsing JSON response...`)
    const data = (await response.json()) as T
    const totalTime = Date.now() - startTime

    console.log(`[${label}] Request completed successfully:`, {
      totalTime: `${totalTime}ms`,
      hasData: !!data,
    })

    return { ok: true, data }
  } catch (error) {
    const totalTime = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[${label}] Request failed:`, {
      error: message,
      errorName: error instanceof Error ? error.name : 'Unknown',
      totalTime: `${totalTime}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { ok: false, error: `${label} failed: ${message}` }
  }
}

interface QueryResponse {
  answer: string
  request_id: string
}

interface DetectResponse {
  objects: Array<{
    x_min: number
    y_min: number
    x_max: number
    y_max: number
  }>
  request_id: string
}

interface PointResponse {
  points: Array<{
    x: number
    y: number
  }>
  request_id: string
}

interface CaptionResponse {
  caption: string
  metrics?: {
    input_tokens: number
    output_tokens: number
    prefill_time_ms: number
    decode_time_ms: number
    ttft_ms: number
  }
  finish_reason: string
}

export function moondreamTools(options: MoondreamOptions) {
  const { apiKey } = options
  console.log('[Moondream Tools] Initializing with API key:', apiKey ? 'present' : 'missing')

  return {
    moondreamQuery: tool({
      description:
        'Answer natural language questions about images using visual question answering. Use this to understand what is in an image or answer specific questions about image content. You can pass the same image data URL that the user uploaded.',
      inputSchema: z.object({
        imageUrl: z
          .string()
          .describe(
            'The image URL or base64 encoded image data URL (data:image/jpeg;base64,...). Use the same data URL from the uploaded image in the conversation.'
          ),
        question: z.string().describe('The natural language question to ask about the image'),
      }),
      execute: async ({ imageUrl, question }) => {
        console.log('[Moondream Query] Called with:', {
          question,
          imageUrlLength: imageUrl.length,
          imageUrlPreview: imageUrl.substring(0, 50) + '...',
        })

        const result = await performMoondreamRequest<QueryResponse>({
          endpoint: 'query',
          payload: {
            image_url: imageUrl,
            question: question,
          },
          apiKey,
          label: 'Moondream Query',
        })

        if (!result.ok) {
          return { error: result.error }
        }

        const data = result.data
        console.log('[Moondream Query] Success:', {
          requestId: data.request_id,
          answerLength: data.answer.length,
        })

        return {
          answer: data.answer,
          requestId: data.request_id,
        }
      },
    }),

    moondreamDetect: tool({
      description:
        'Detect and locate objects in an image with bounding boxes. Returns normalized coordinates (0-1) for object locations and creates a visual overlay showing detected objects. Use this when the user wants to see WHERE objects are located with bounding boxes drawn on the image.',
      inputSchema: z.object({
        imageUrl: z
          .string()
          .describe(
            'The image URL or base64 encoded image data URL (data:image/jpeg;base64,...). Use the same data URL from the uploaded image in the conversation.'
          ),
        object: z
          .string()
          .describe(
            'The object to detect in the image (e.g., "person", "car", "face", "dog"). Can detect any object type.'
          ),
      }),
      execute: async ({ imageUrl, object }) => {
        console.log('[Moondream Detect] Called with:', {
          object,
          imageUrlLength: imageUrl.length,
          imageUrlPreview: imageUrl.substring(0, 50) + '...',
        })

        const result = await performMoondreamRequest<DetectResponse>({
          endpoint: 'detect',
          payload: {
            image_url: imageUrl,
            object: object,
          },
          apiKey,
          label: 'Moondream Detect',
        })

        if (!result.ok) {
          return {
            error: result.error,
          }
        }

        const data = result.data
        console.log('[Moondream Detect] Success:', {
          requestId: data.request_id,
          objectsFound: data.objects.length,
        })

        return {
          imageUrl,
          object,
          objects: data.objects.map(obj => ({
            xMin: obj.x_min,
            yMin: obj.y_min,
            xMax: obj.x_max,
            yMax: obj.y_max,
          })),
          requestId: data.request_id,
          count: data.objects.length,
          visualizationType: 'bounding-boxes' as const,
        }
      },
    }),

    moondreamPoint: tool({
      description:
        'Get precise center point coordinates for objects in an image. Returns normalized coordinates (0-1) for the center of each detected object and creates a visual overlay with point markers. Use this when the user wants to see POINT locations marked on the image.',
      inputSchema: z.object({
        imageUrl: z
          .string()
          .describe(
            'The image URL or base64 encoded image data URL (data:image/jpeg;base64,...). Use the same data URL from the uploaded image in the conversation.'
          ),
        object: z
          .string()
          .describe(
            'The object to point to in the image (e.g., "face", "building", "logo"). Can point to any object type.'
          ),
      }),
      execute: async ({ imageUrl, object }) => {
        console.log('[Moondream Point] Called with:', {
          object,
          imageUrlLength: imageUrl.length,
          imageUrlPreview: imageUrl.substring(0, 50) + '...',
        })

        const result = await performMoondreamRequest<PointResponse>({
          endpoint: 'point',
          payload: {
            image_url: imageUrl,
            object: object,
          },
          apiKey,
          label: 'Moondream Point',
        })

        if (!result.ok) {
          return { error: result.error }
        }

        const data = result.data
        console.log('[Moondream Point] Success:', {
          requestId: data.request_id,
          pointsFound: data.points.length,
        })

        return {
          imageUrl,
          object,
          points: data.points.map(point => ({
            x: point.x,
            y: point.y,
          })),
          requestId: data.request_id,
          count: data.points.length,
          visualizationType: 'points' as const,
        }
      },
    }),

    moondreamCaption: tool({
      description:
        'Generate detailed natural language descriptions of images. Use this to get specialized captions or when you want a highly detailed description beyond what you can see directly.',
      inputSchema: z.object({
        imageUrl: z
          .string()
          .describe(
            'The image URL or base64 encoded image data URL (data:image/jpeg;base64,...). Use the same data URL from the uploaded image in the conversation.'
          ),
        length: z
          .enum(['short', 'normal', 'long'])
          .optional()
          .describe('The desired length of the caption (default: normal)'),
        stream: z.boolean().optional().describe('Whether to stream the caption (default: false)'),
      }),
      execute: async ({ imageUrl, length = 'normal', stream = false }) => {
        console.log('[Moondream Caption] Called with:', {
          length,
          stream,
          imageUrlLength: imageUrl.length,
          imageUrlPreview: imageUrl.substring(0, 50) + '...',
        })

        const result = await performMoondreamRequest<CaptionResponse>({
          endpoint: 'caption',
          payload: {
            image_url: imageUrl,
            length: length,
            stream: stream,
          },
          apiKey,
          label: 'Moondream Caption',
        })

        if (!result.ok) {
          return { error: result.error }
        }

        const data = result.data
        console.log('[Moondream Caption] Success:', {
          captionLength: data.caption.length,
          finishReason: data.finish_reason,
          metrics: data.metrics,
        })

        return {
          caption: data.caption,
          metrics: data.metrics
            ? {
                inputTokens: data.metrics.input_tokens,
                outputTokens: data.metrics.output_tokens,
                prefillTimeMs: data.metrics.prefill_time_ms,
                decodeTimeMs: data.metrics.decode_time_ms,
                ttftMs: data.metrics.ttft_ms,
              }
            : undefined,
          finishReason: data.finish_reason,
        }
      },
    }),
  }
}

import { anthropic } from '@ai-sdk/anthropic'
import { supermemoryTools } from '@supermemory/tools/ai-sdk'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { moondreamTools } from '@/moondream-tools'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: unknown }

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 })
    }

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(body.messages)

    const result = streamText({
      model: anthropic('claude-sonnet-4-5'),
      system: `You are **Pocket Senpai**, a helpful and knowledgeable AI assistant. Your purpose is to guide users by answering their questions.

You have access to a specialized tool:

### 1. 🧠 Supermemory: Documentation Search

* **Purpose:** This tool is **only** for searching and retrieving information from the existing knowledge base, which contains documentation, guides, and manuals.
* **Trigger:** Use the \`supermemoryTools\` **only when the user asks a question that requires looking up information**. This includes questions like "How do I...", "What is [feature]?", "Explain [concept]", or any query that implies searching for established documentation.
* **Constraint:** You **must not** use this tool to store new memories or for general conversation. Its sole function is to search the existing guides.

### General Directives

* If a user asks a general question (e.g., "Hello," "How are you?"), just respond naturally without using any tools.
* When the Supermemory tool provides a result, use that information to construct your answer to the user.
* If you use the tool and it doesn't find a relevant answer, inform the user (e.g., "I couldn't find that in the documentation.").`,
      messages: modelMessages,
      tools: {
        ...supermemoryTools(process.env.SUPERMEMORY_API_KEY!, {
          containerTags: ['pocket-senpai'],
        }),
      },
      // Enable multi-step calls: allow up to 5 steps if tools are called
      // This ensures the model continues after tool execution to provide a response
      stopWhen: stepCountIs(5),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error)
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), { status: 500 })
  }
}

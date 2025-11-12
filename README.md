# Pocket Senpai

This is a [Next.js](https://nextjs.org) project with AI capabilities including Supermemory and Moondream integration.

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required variables:
- `SUPERMEMORY_API_KEY` - Get from [Supermemory](https://supermemory.ai)
- `ANTHROPIC_API_KEY` - Get from [Anthropic Console](https://console.anthropic.com)

Optional variables:
- `MOONDREAM_API_KEY` - Get from [Moondream](https://moondream.ai) to enable vision capabilities

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Usage Examples

### Vision with Moondream

1. **Upload an image** using the image button in the chat
2. **Ask vision-related questions**:
   - "What's in this image?" (uses direct Claude vision)
   - "Detect all the people in this photo" (uses moondreamDetect - shows bounding boxes)
   - "Point to all the faces" (uses moondreamPoint - shows red markers)
   - "Give me a detailed description" (uses moondreamCaption)
   - "Where are the cars located?" (uses moondreamDetect with visual overlay)

### Memory with Supermemory

1. **Save information**: "Remember that I prefer morning meetings"
2. **Recall information**: "What did I tell you about my preferences?"
3. **Search memories**: "What documents have I uploaded about AI?"

## Features

### AI Chat with Tools

The chat API (`/api/chat`) includes:

- **Supermemory Tools**: Memory and knowledge management
- **Moondream Tools**: Vision capabilities for image understanding

### Image Upload

The chat interface supports uploading images:
- Click the image icon to select one or more images
- Preview uploaded images before sending
- Remove images from the upload by clicking the × button
- Images are sent as file parts in the message and can be analyzed by the AI

### Moondream Vision Tools with Visual Overlays

When `MOONDREAM_API_KEY` is configured, the following vision tools are available for the AI to use:

1. **moondreamQuery**: Answer natural language questions about images
   - Example: "What is in this image?"
   - The AI can use this to answer specific questions about uploaded images
   
2. **moondreamDetect**: Detect and locate objects with bounding boxes
   - **Visual overlay**: Draws green bounding boxes around detected objects
   - Returns normalized coordinates (0-1) for object locations
   - Example: "Show me where all the people are in this image"
   - Useful for object recognition and scene understanding
   
3. **moondreamPoint**: Get precise center coordinates for objects
   - **Visual overlay**: Places red point markers at object centers
   - Returns normalized coordinates (0-1) for object centers
   - Example: "Point to all the faces in this picture"
   - Helpful for counting and locating specific items
   
4. **moondreamCaption**: Generate natural language descriptions of images
   - Supports short, normal, and long caption lengths
   - Great for getting detailed descriptions of image content
   - Example: "Give me a detailed description of this image"

#### How Visualizations Work

When you ask the AI to detect or point to objects:
1. The AI calls the appropriate Moondream tool with your uploaded image
2. Moondream returns the coordinates of detected objects
3. The system automatically draws visual annotations on your image:
   - **Bounding boxes** (green rectangles) for detected objects
   - **Point markers** (red circles) for precise locations
   - **Labels** showing which object was detected

All tools accept the same image data URLs that you upload. The AI will automatically choose which tool to use based on your question.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

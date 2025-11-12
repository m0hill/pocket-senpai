#Youtube-demo
https://www.youtube.com/watch?v=r4B04h9fQpo&feature=youtu.be

# Pocket Senpai

Your expert senior colleague in your pocket. A multilingual AI assistant that helps workers understand machinery, procedures, and safety protocols by breaking down language barriers.

## 🚀 Features

### 🌐 Multi-Language Support
- **Native Language Input**: Ask questions in Vietnamese, Tagalog, English, Japanese, and more
- **Cross-Language Understanding**: Upload Japanese manuals and get answers in your native language
- **Real-time Translation**: Instant translation of technical documentation

### 🤖 AI-Powered Chat
- **Expert Knowledge**: Like having a senior colleague who knows everything about your work
- **24/7 Availability**: Always ready to help with emergencies, operations, and maintenance
- **Context-Aware**: Understands your specific work environment and needs

### 📚 Document Management
- **Upload Manuals**: Add machinery manuals, safety procedures, and work instructions
- **Smart Processing**: Documents become searchable and referenceable in chat
- **Multiple Formats**: Support for PDF, images, Office docs, text files, and web URLs

### 📱 Progressive Web App
- **Install as App**: Works offline and can be installed on any phone
- **Mobile-First Design**: Optimized for field use on smartphones
- **Terminal Interface**: Familiar command-line style interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, next-themes
- **AI**: Anthropic Claude, Supermemory, Moondream (vision)
- **Deployment**: Cloudflare Pages with OpenNext
- **Internationalization**: lingo.dev
- **Development**: Biome, ESLint, Wrangler

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pocket-senpai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure API keys**
   Edit `.env.local` and add:
   ```
   SUPERMEMORY_API_KEY=your_supermemory_key
   ANTHROPIC_API_KEY=your_anthropic_key
   MOONDREAM_API_KEY=your_moondream_key  # Optional for vision features
   ```

## 🚀 Getting Started

### Development
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# Preview locally
npm run preview
```

## 📖 Usage

### Chat Interface
1. **Ask Questions**: Type any work-related question in your native language
2. **Upload Images**: Add images for visual analysis and troubleshooting
3. **Get Instant Answers**: Receive expert guidance in seconds

### Document Upload
1. **Navigate to Memories**: Click `[UPLOAD_MANUAL]` on the home page
2. **Choose Upload Type**: Text, File, or URL
3. **Add Content**: Upload manuals, procedures, or documentation
4. **Tag & Organize**: Use container tags to group related content

### Example Use Cases

#### Emergency Situations
- "Machine is overheating, what do I do?"
- "Emergency stop button not working, help!"
- "Machine making strange noises, is it safe?"

#### Daily Operations
- "How do I safely clean this equipment?"
- "What safety gear do I need for this task?"
- "Step-by-step startup procedure?"

#### Maintenance & Repair
- "How often should I check the oil level?"
- "What does this warning light mean?"
- "Safe way to replace this part?"

#### Manual Translation
- "What does this Japanese procedure mean?"
- "Explain this technical diagram"
- "Translate these safety instructions"

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPERMEMORY_API_KEY` | Yes | API key for Supermemory knowledge base |
| `ANTHROPIC_API_KEY` | Yes | API key for Anthropic Claude |
| `MOONDREAM_API_KEY` | Optional | API key for Moondream vision features |

### API Integration

#### Supermemory
- **Purpose**: Search and retrieve information from uploaded documentation
- **Usage**: Automatically searches knowledge base when relevant questions are asked
- **Container Tags**: Organize documents with tags like 'imported', 'machinery', 'safety'

#### Moondream Vision
- **Purpose**: Image analysis and object detection
- **Features**:
  - Object detection with bounding boxes
  - Point marking for precise locations
  - Natural language image descriptions
- **Usage**: Upload images and ask visual questions

## 🌍 Internationalization

The application supports multiple languages through lingo.dev:

- **English** (default)
- **Español** (Spanish)
- **Français** (French)
- **Deutsch** (German)
- **日本語** (Japanese)
- **中文** (Chinese)
- **Tiếng Việt** (Vietnamese)
- **Tagalog** (Filipino)

## 📱 PWA Features

### Installation
1. Open the app in your mobile browser
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will be available offline

### Service Worker
- Automatic registration for offline functionality
- Cache management for better performance
- Background sync capabilities

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Biome

# Cloudflare
npm run deploy       # Deploy to Cloudflare Pages
npm run upload       # Upload to Cloudflare
npm run preview      # Preview locally
npm run cf-typegen   # Generate Cloudflare types

# Utilities
npm run generate-icons  # Generate app icons
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat endpoint
│   │   └── memories/      # Document management endpoints
│   ├── chat/              # Chat interface page
│   ├── memories/          # Document upload page
│   ├── lingo/             # Internationalization
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ImageWithAnnotations.tsx  # Vision tool visualizations
│   └── theme-provider.tsx       # Theme management
├── moondream-tools.ts     # Vision AI tools
└── globals.css           # Global styles
```

## 🔒 Security

- **API Keys**: Environment variables for secure API key management
- **Input Validation**: Server-side validation for all inputs
- **File Upload**: Secure file handling with type restrictions
- **CORS**: Proper cross-origin resource sharing configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run linting and formatting: `npm run lint && npm run format`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the existing documentation
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Contact the development team

## 🗺️ Roadmap

- [ ] Voice input and output
- [ ] More language support
- [ ] Advanced image analysis
- [ ] Integration with machinery APIs
- [ ] Team collaboration features
- [ ] Custom training on company documents

---

**Pocket Senpai v1.0** - Your expert colleague, always ready to help.

> STATUS: ONLINE | READY_TO_ASSIST | SAFETY_ASSISTANT_SYSTEM
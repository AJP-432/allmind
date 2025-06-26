# AllMind AI Co-op Application

A full-stack web application that replicates the Rogo AI landing page with an AI-powered copilot chatbot, built for the AllMind AI Co-op technical assignment.

## 🎯 Project Overview

This project demonstrates a production-grade web application featuring:

- **Landing Page**: Inspired by Rogo.ai (todo: improve landing page recreation)
- **AI Copilot**: Real-time chatbot powered by Google's Gemini API
- **Chat History**: Persistent storage and viewing of chat sessions
- **Hotkey Access**: Quick chatbot access via keyboard shortcuts

## 🛠 Technology Stack

### Frontend

- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library (zinc theme)
- **Geist Sans/Mono** fonts
- **WebSockets** for real-time communication

### Backend

- **Go 1.23+** with Gorilla WebSocket
- **Google Gemini API** via `github.com/googleapis/go-genai`
- **Google Firestore** for chat persistence
- **WebSocket-only** communication (no REST)

### Deployment

- **Docker** containers
- **Google Cloud Run** (Toronto region)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Go 1.23+
- Docker and Docker Compose
- Google Cloud SDK (for deployment)

### 1. Clone & Install

```bash
git clone <repository-url>
cd allmind
pnpm install
```

### 2. Environment Setup

Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env
# Add your Gemini API key

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Add your Firebase configuration
```

### 3. Local Development

```bash
# Start both frontend and backend
pnpm dev:frontend  # http://localhost:3000
pnpm dev:backend   # http://localhost:8080
```

## 🏗 Project Structure

```
allmind/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities & configs
│   ├── Dockerfile
│   └── package.json
├── backend/                 # Go server
│   ├── cmd/server/          # Main application
│   ├── internal/            # Private packages
│   ├── Dockerfile
│   ├── go.mod
│   └── .env
├── .github/                 # Documentation
├── deploy-*.sh              # Deployment scripts
├── docker-compose.yml       # Local development
└── package.json             # Root workspace config
```

## 💬 Using the Copilot

1. **Access**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open the chat
2. **Chat**: Type your message and press Enter
3. **History**: View previous conversations in the chat history section
4. **Close**: Press `Escape` or click outside to close

### 🎨 Design Specifications

- **Theme**: Neutral zinc color scheme
- **Typography**: Geist Sans for UI, Geist Mono for code/data
- **Responsive**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and hotkeys

## 🤝 Contributing

This project follows conventional commits and includes:

- **Husky**: Git hooks for quality checks
- **Commitlint**: Conventional commit enforcement
- **Prettier**: Code formatting
- **Lint-staged**: Pre-commit formatting

## 📄 License

Built for AllMind AI Co-op Application - Technical Assignment

# AllMind AI Co-op Project Status

## Project Overview

Building a full-stack web application that replicates the Rogo AI landing page (https://rogo.ai) with an AI-powered copilot chatbot for the AllMind AI Co-op technical assignment.

## Project Guide

We aim for building a responsive web-application suitable for both mobile and desktop devices, with clean code being paramount. No hacky solutions, unless absolutely necessary and justified (subject to human approval), as we strive for production-grade, best-practices software. Always try to use pre-built components and libraries/apis to avoid having to solve problems with known solutions.

## Project Structure

```
allmind-copilot/
├── frontend/          # Next.js 15 application
├── backend/           # Go backend server
├── docker/            # Docker configuration files
├── .husky/            # Git hooks
└── package.json       # Root package.json with monorepo scripts
```

## Technology Stack

### Frontend

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui with neutral theme
- **Fonts**: Geist Sans and Geist Mono
- **Build Tool**: Native Next.js build system

### Backend

- **Language**: Go (Golang)
- **AI Integration**: Will use Gemini API via `github.com/googleapis/go-genai`
- **Communication**: WebSockets (required, not REST)
- **Database**: Google Bigtable (for chat history storage)

### Deployment

- **Containerization**: Docker
- **Hosting**: Google Cloud Run
- **Database**: Google Bigtable with UNIX timestamp row keys

## Completed Setup Tasks

### 1. Monorepo Structure

- ✅ Created root directory with proper folder structure
- ✅ Initialized Git repository
- ✅ Set up frontend and backend directories

### 2. Frontend Setup

- ✅ Created Next.js 15 app with TypeScript and Tailwind CSS
- ✅ Configured shadcn/ui with zinc theme
- ✅ Installed and configured Geist fonts (Sans and Mono)
- ✅ Replicate Rogo AI landing page design
- ✅ Create hotkey-accessible chat interface

### 3. Backend Setup

- ✅ Initialized Go module (`allmind-copilot/backend`)
- ✅ Set up proper Go project structure with cmd/internal/pkg folders

### 4. Development Tooling

- ✅ Configured Husky for Git hooks
- ✅ Set up commitlint with conventional commit format
- ✅ Configured Prettier for code formatting
- ✅ Set up lint-staged for pre-commit formatting
- ✅ Created comprehensive npm scripts for development

### 5. Configuration Files

- ✅ `.commitlintrc.json` - Conventional commit rules
- ✅ `.prettierrc` - Code formatting rules
- ✅ `.lintstagedrc.json` - Pre-commit hook configuration
- ✅ `.gitignore` - Proper exclusions for Node.js and Go
- ✅ Root `package.json` with workspace configuration

## Current Status

- ✅ Initial git commit completed
- ✅ Development environment fully configured
- ✅ Both frontend and backend servers can run locally
- ✅ Code quality tools working (Prettier, linting, commit hooks)
- ✅ Implement real-time chat communication
- ✅ Connect to Google's Gemini API (in the websocket)
- ✅ Have real-time websocket communication with the Websocket and Gemini and make a unit test
- ✅ Connected backend websocket to frontend, with a responsive, scrollable chat area and chat messages

## Available NPM Scripts

```json
{
  "dev:frontend": "cd frontend && npm run dev",
  "dev:backend": "cd backend && go run cmd/server/main.go",
  "build:frontend": "cd frontend && npm run build",
  "build:backend": "cd backend && go build -o bin/server cmd/server/main.go",
  "lint:frontend": "cd frontend && npm run lint",
  "lint:backend": "cd backend && go vet ./...",
  "format:frontend": "cd frontend && prettier --write .",
  "format:backend": "cd backend && gofmt -w ."
}
```

## Next Steps (Ready to Begin)

1. **Chat History**: Implement Bigtable storage and history viewer (table of previous messages on the frontend)
2. **Dockerization**: Create Docker containers for deployment
3. **Cloud Deployment**: Deploy to Google Cloud Run

## Development Servers

- Frontend: `http://localhost:3000` (Next.js)
- Backend: `http://localhost:8080` (Go server)

## Key Features to Implement

- WebSocket-based real-time chat
- Chat history table with row keys display
- Google Bigtable integration for persistence
- Docker containerization for deployment

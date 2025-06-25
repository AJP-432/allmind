## AllMind AI Co-op Application Task: Project Brief

This document outlines the requirements for the AllMind AI Round One Co-op technical assignment. The goal is to build a functional web application that replicates a chosen landing page and includes a custom AI-powered "co-pilot".

### 1. Core Task Overview

Your primary objective is to replicate one of the landing pages from the provided list and build a co-pilot chatbot that can be accessed via hotkeys. The final product must be a deployed, full-stack application.

**Project Components:**

- **Landing Page Replication:** We will recreate:
  - Rogo AI: `https://rogo.ai`

- **Co-Pilot Chatbot:**
  - Develop a chatbot that users can interact with through an LLM.
  - The chatbot UI must be accessible (open and close) via hotkeys. You must clearly state on the landing page how to access it.

- **Chat History Viewer:**
  - Implement a section on the website that displays a table of chat histories.
  - The table should show the row keys of the stored chat sessions.

### 2. Technical Stack & Requirements

Adherence to the specified technology stack is mandatory.

#### **Development Stack**

- **Frontend:** Next.js 15
- **Backend:** Golang (Go)
  - **Note:** The use of Python is explicitly forbidden for the deployment stack.
- **AI Integration:** You must use the Gemini API via the official Golang Google Package (`github.com/googleapis/go-genai`).
- **Real-time Communication:** The connection between the frontend and the chatbot backend must be established using WebSockets, not REST API calls.

#### **Deployment Stack**

- **Containerization:** The application must be containerized using Docker. You can choose to set up a single container or two separate containers for the website and chatbot.
- **Hosting:** The Docker container(s) must be deployed to Google Cloud Run.
- **Database:** All chat histories must be stored in Google Firestore.
  - **Row Keys:** As there is no authentication, use the UNIX timestamp for the row keys.

### 3. Frontend Implementation Details

#### **UI Components & Styling**

- **Component Library:** You are required to use **shadcn/ui**.
- **Theme:** Implement a basic, neutral color scheme. You should use the default `zinc` theme provided by shadcn/ui.
- **Font:**
  - The primary font for the application will be **Geist**.
  - Use **Geist Sans** for all general text, such as headings and paragraphs.
  - Use **Geist Mono** for displaying any code snippets, tabular data (like the chat history table), or technical text.

### 4. What Not to Do

The employer has specifically stated they do not want "vibe coding." This means your code should be clean, well-structured, and robust, suitable for an environment managing significant financial data, rather than a "build fast and break things" approach.

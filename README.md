# Agentic AI Platform

A professional production-ready orchestration platform wrapping high-fidelity AI agents with a Python FastAPI backend and a responsive React (Vite + Tailwind CSS) dashboard frontend.

Preserves the existing agent implementation (`agent.py`, `team.py`, `memory.py`, `finance.py`, `youtube_analyzer.py`) while introducing local API wrappers, SSE chat streaming, database querying, and sleek dark mode glassmorphic interfaces.

---

## Project Structure

```text
agentic-ai/
├── backend/
│   ├── agent.py               # Travel Agent (Original)
│   ├── team.py                # Multi-language translation team (Original)
│   ├── memory.py              # Cognitive Memory Agent (Original)
│   ├── finance.py             # Stock market research agent (Original)
│   ├── youtube_analyzer.py    # YouTube summary agent (Original)
│   ├── api.py                 # FastAPI Web Server & API wrappers
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Backend environment template
│   └── agno.db                # SQLite user memory storage database
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Layout & visual helper components
│   │   ├── pages/             # Dashboard, Chat, Analyzer pages
│   │   ├── services/          # Axios backend wrapper client (api.js)
│   │   ├── App.jsx            # Routing configuration
│   │   └── index.css          # Design system stylesheet
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind setup
│   └── vite.config.js         # Vite bundler configuration & proxies
│
├── render.yaml                # Infrastructure configuration for Render
└── README.md                  # System overview & setup guides (This file)
```

---

## Local Setup & Development

### 1. Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (with npm)
- **API Keys**: A Groq API Key and/or OpenAI API Key (depending on models configured in agents)

### 2. Backend Setup
1. Navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and populate with your API credentials:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to include:
   ```env
   GROQ_API_KEY=your-groq-key-here
   OPENAI_API_KEY=your-openai-key-here
   ```
5. Run the server:
   ```bash
   python api.py
   ```
   The backend server will run on `http://localhost:8000`.

### 3. Frontend Setup
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`. Any requests to `/api` are automatically proxied to `http://localhost:8000`.

---

## API Endpoints

- **`GET /health`**: Returns system status and database connection verification.
- **`GET /agents`**: Lists all available agents, their description, model details, and capabilities.
- **`POST /chat`**: Receives user queries and routes to the selected agent. Supports regular JSON response or Server-Sent Events (SSE) streaming (`stream: true`).
- **`POST /finance-analysis`**: Extracts fundamental parameters and prices for a ticker symbol.
- **`POST /youtube-analysis`**: Synthesizes structured timestamp highlights and summaries from video feeds.
- **`GET /memory`**: Retrieves records from the persistent memory store (`agno.db`) with support for page pagination and user filters.
- **`POST /memory/search`**: Searches memory records using text-matching queries.

---

## Production Deployment (Render)

This project is prepared for single-click orchestration on [Render](https://render.com) using the `render.yaml` template.

1. Push this repository to GitHub.
2. In Render, select **Blueprints** and connect your repository.
3. Configure the environment variables (`GROQ_API_KEY`, `OPENAI_API_KEY`) when prompted.
4. Render will automatically spin up the FastAPI service and deploy the frontend build directory statically.

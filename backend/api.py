import os
import sys
import json
import sqlite3
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Add current directory to path for imports to work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# -------------------------------------------------------------
# IMPORT PATCHING SYSTEM
# -------------------------------------------------------------
# To prevent agent.print_response or db.clear_memories from executing
# and making API/DB calls during import, we temporarily patch them.
from agno.agent import Agent
from agno.team import Team
from agno.db.sqlite import SqliteDb

original_clear_memories = SqliteDb.clear_memories
original_agent_print = Agent.print_response
original_team_print = Team.print_response
original_agent_run = Agent.run
original_team_run = Team.run

# Temporary no-op overrides
SqliteDb.clear_memories = lambda self: None
Agent.print_response = lambda *args, **kwargs: None
Team.print_response = lambda *args, **kwargs: None
Agent.run = lambda *args, **kwargs: None
Team.run = lambda *args, **kwargs: None

try:
    import agent as travel_module
    import team as team_module
    import memory as memory_module
    import finance as finance_module
    import youtube_analyzer as youtube_module
finally:
    # Restore original functionalities for actual API endpoints
    SqliteDb.clear_memories = original_clear_memories
    Agent.print_response = original_agent_print
    Team.print_response = original_team_print
    Agent.run = original_agent_run
    Team.run = original_team_run

# -------------------------------------------------------------
# RE-INITIALIZE OR IMPORT WORKING AGENTS
# -------------------------------------------------------------
# We grab the agents created in the modules
travel_agent = travel_module.agent
team_leader = team_module.team_leader
memory_agent = memory_module.agent
finance_agent = finance_module.agent
youtube_agent = youtube_module.youtube_agent

# DB File Path helper
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "agno.db")

# -------------------------------------------------------------
# FASTAPI APP SETUP
# -------------------------------------------------------------
app = FastAPI(
    title="Agentic AI Platform API",
    description="FastAPI wrappers around the existing Agentic AI agents (Travel, Translation, Finance, YouTube, Memory)",
    version="1.0.0"
)

# CORS configuration to allow local development & production access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# PYDANTIC MODEL SCHEMAS
# -------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str = Field(..., description="Message input for the AI agent")
    agent_id: str = Field("travel", description="Target Agent ID: travel, team, finance, youtube, memory")
    user_id: Optional[str] = Field(None, description="Optional User ID for tracking session/memory")
    stream: bool = Field(False, description="Whether to stream the response chunk-by-chunk")

class FinanceRequest(BaseModel):
    symbol: str = Field(..., description="Stock symbol, e.g., NVDA, AAPL")

class YoutubeRequest(BaseModel):
    url: str = Field(..., description="Full YouTube video URL")

class MemorySearchRequest(BaseModel):
    query: str = Field(..., description="Keyword search query for memories")
    user_id: Optional[str] = Field(None, description="Optional User ID to filter search results")

# Helper function to get SQLite connection safely
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# -------------------------------------------------------------
# ENDPOINTS
# -------------------------------------------------------------

@app.get("/health")
async def health_check():
    """Simple API health check endpoint."""
    return {
        "status": "healthy",
        "database_connected": os.path.exists(DB_PATH)
    }

@app.get("/agents")
async def get_agents():
    """Returns a list of all available agents with their profiles, models, and capabilities."""
    return [
        {
            "id": "travel",
            "name": "Travel Planner Agent",
            "role": "Travel Analyst & Advisor",
            "description": "Helps you research travel destinations, search the web for safety advisories, and map out complete travel itineraries.",
            "capabilities": ["Web search", "Real-time travel advisories", "Itinerary planning"],
            "tools": ["DuckDuckGo Search"],
            "model": "qwen/qwen3-32b",
            "status": "active"
        },
        {
            "id": "team",
            "name": "Multi-Language Translation Team",
            "role": "Multi-lingual Team Leader",
            "description": "Orchestrates a group of sub-agents (English, Chinese, and Hindi Agents) to translate and answer questions concurrently.",
            "capabilities": ["Multi-agent collaboration", "Simultaneous translation", "Cross-language synthesis"],
            "tools": ["English Agent", "Chinese Agent", "Hindi Agent"],
            "model": "qwen/qwen3-32b",
            "status": "active"
        },
        {
            "id": "finance",
            "name": "Financial Stock Analyst",
            "role": "Investment & Stock Researcher",
            "description": "Researches live stock prices, queries analyst recommendations, and extracts corporate fundamentals using financial API integrations.",
            "capabilities": ["Stock pricing", "Analyst recommendations", "Financial table extraction"],
            "tools": ["Yahoo Finance API", "DuckDuckGo Search"],
            "model": "qwen/qwen3-32b",
            "status": "active"
        },
        {
            "id": "youtube",
            "name": "YouTube Video Analyzer",
            "role": "Video Content Analyst",
            "description": "Processes YouTube video links to extract structural timelines, timestamps, detailed chapter summaries, and creative insights.",
            "capabilities": ["Video summarization", "Timestamp segmentation", "Key takeaway extraction"],
            "tools": ["YouTube Data Retrieval Tools"],
            "model": "qwen/qwen3-32b",
            "status": "active"
        },
        {
            "id": "memory",
            "name": "Cognitive Memory Agent",
            "role": "Persistent Profile Builder",
            "description": "Retains key personal facts and preferences across conversations, reading and writing to a persistent SQLite SQLite memory database.",
            "capabilities": ["Persistent SQLite memory", "User profile learning", "Context recall"],
            "tools": ["SQLite Memory Store"],
            "model": "qwen/qwen3-32b",
            "status": "active"
        }
    ]

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Unified chat endpoint supporting multiple agents and streaming (SSE).
    """
    # Select the agent
    agent_id = request.agent_id.lower()
    selected_agent = travel_agent
    
    if agent_id == "team":
        selected_agent = team_leader
    elif agent_id == "finance":
        selected_agent = finance_agent
    elif agent_id == "youtube":
        selected_agent = youtube_agent
    elif agent_id == "memory":
        selected_agent = memory_agent

    # Prepare execution parameters (like user_id for memory agent)
    run_kwargs = {}
    if agent_id == "memory":
        run_kwargs["user_id"] = request.user_id or "rahul@gmail.com"

    # Handle streaming
    if request.stream:
        async def event_generator():
            try:
                # Run the agent in streaming mode
                response_stream = selected_agent.run(request.message, stream=True, **run_kwargs)
                for chunk in response_stream:
                    content = ""
                    if hasattr(chunk, "content") and chunk.content is not None:
                        content = chunk.content
                    elif isinstance(chunk, str):
                        content = chunk
                    
                    if content:
                        yield f"data: {json.dumps({'content': content})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    # Handle non-streaming
    try:
        response = selected_agent.run(request.message, **run_kwargs)
        # Handle some cases where agent response is raw text or has content attribute
        content = response.content if hasattr(response, "content") else str(response)
        return {"response": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/finance-analysis")
async def finance_analysis(request: FinanceRequest):
    """
    Performs stock and investment analysis using the finance agent.
    """
    ticker = request.symbol.upper().strip()
    prompt = f"Share the {ticker} stock price and analyst recommendations"
    
    try:
        response = finance_agent.run(prompt)
        content = response.content if hasattr(response, "content") else str(response)
        
        # Synthesize simple summary/insights from the stock symbol to fill schema
        return {
            "analysis": content,
            "summary": f"Detailed stock price performance, metrics and analyst analysis for {ticker}.",
            "insights": f"Key investment perspectives and recommendation profiles retrieved for ticker {ticker}."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/youtube-analysis")
async def youtube_analysis(request: YoutubeRequest):
    """
    Performs comprehensive video summary and timestamp creation using the YouTube analyzer agent.
    """
    url = request.url.strip()
    prompt = f"Analyze this video: {url}"
    
    try:
        response = youtube_agent.run(prompt)
        content = response.content if hasattr(response, "content") else str(response)
        
        return {
            "analysis": content,
            "summary": f"Video analysis report generated for url: {url}.",
            "insights": "Detailed content structures, timestamps, and creative categories extracted from video transcript."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory")
async def get_memories(
    user_id: Optional[str] = Query(None, description="Filter memories by user ID"),
    q: Optional[str] = Query(None, description="Search term to filter memory text"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Queries and returns memory records from the agno.db Sqlite database.
    Supports pagination, user filtering, and text searches.
    """
    if not os.path.exists(DB_PATH):
        return []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT memory_id, memory, input, user_id, created_at, updated_at FROM agno_memories"
        conditions = []
        params = []
        
        if user_id:
            conditions.append("user_id = ?")
            params.append(user_id)
            
        if q:
            conditions.append("(memory LIKE ? OR input LIKE ?)")
            params.append(f"%{q}%")
            params.append(f"%{q}%")
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        memories = []
        for r in rows:
            # Parse memory JSON if stored as JSON string
            mem_text = r["memory"]
            try:
                # Sometimes it is double JSON serialized or string representation
                parsed_mem = json.loads(mem_text)
                if isinstance(parsed_mem, dict) and "memory" in parsed_mem:
                    mem_text = parsed_mem["memory"]
                elif isinstance(parsed_mem, str):
                    mem_text = parsed_mem
            except Exception:
                pass
                
            memories.append({
                "memory_id": r["memory_id"],
                "memory": mem_text,
                "input": r["input"],
                "user_id": r["user_id"],
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            })
            
        conn.close()
        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

@app.post("/memory/search")
async def search_memories(request: MemorySearchRequest):
    """
    Searches memory records matching a query.
    """
    if not os.path.exists(DB_PATH):
        return []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT memory_id, memory, input, user_id, created_at, updated_at FROM agno_memories"
        conditions = ["(memory LIKE ? OR input LIKE ?)"]
        params = [f"%{request.query}%", f"%{request.query}%"]
        
        if request.user_id:
            conditions.append("user_id = ?")
            params.append(request.user_id)
            
        query += " WHERE " + " AND ".join(conditions)
        query += " ORDER BY created_at DESC"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        memories = []
        for r in rows:
            mem_text = r["memory"]
            try:
                parsed_mem = json.loads(mem_text)
                if isinstance(parsed_mem, dict) and "memory" in parsed_mem:
                    mem_text = parsed_mem["memory"]
                elif isinstance(parsed_mem, str):
                    mem_text = parsed_mem
            except Exception:
                pass
                
            memories.append({
                "memory_id": r["memory_id"],
                "memory": mem_text,
                "input": r["input"],
                "user_id": r["user_id"],
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            })
            
        conn.close()
        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database search failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)

# NeuraGraph

NeuraGraph is an AI-powered knowledge graph builder. It turns raw text into
structured entities, relationships, and an interactive graph explorer.

The product experience is designed as a dark graph intelligence dashboard:
text ingestion, NLP extraction, graph persistence, live results, and React Flow
visualization all work together as one analysis workflow.

## Features

- Paste raw text and build a knowledge graph
- Extract entities with spaCy
- Create graph nodes and relationship edges
- Display extraction results with node and edge counts
- Explore the graph with React Flow
- Use custom graph nodes with entity-type icons
- Refresh graph data from the backend
- Inspect selected graph nodes in a side panel

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Flow
- lucide-react
- Axios

Backend:
- FastAPI
- spaCy
- SQLAlchemy
- SQLite
- Uvicorn

## Project Structure

```text
neuragraph/
  backend/
    app/
      main.py
      routes/
      nlp/
      models.py
      schemas.py
      database.py
    requirements.txt
  frontend/
    src/
      api/
      components/
      pages/
    package.json
    vite.config.js
  render.yaml
  vercel.json
```

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

In local development, Vite proxies frontend `/api/*` requests to the FastAPI
backend.

## Environment Variables

For production frontend deployments, set:

```text
VITE_API_BASE_URL=https://your-backend-url
```

The backend supports production frontend origins through:

```text
FRONTEND_ORIGINS=https://your-frontend-url
```

## Deployment

The repository includes deployment configuration for:

- Render backend: `render.yaml`
- Vercel frontend: `vercel.json`

Recommended deployment order:

1. Deploy the backend on Render.
2. Copy the Render backend URL.
3. Deploy the frontend on Vercel.
4. Set `VITE_API_BASE_URL` in Vercel to the Render backend URL.
5. Set `FRONTEND_ORIGINS` in Render to the Vercel frontend URL.

## API Endpoints

Primary frontend integration points:

```text
POST /ingest/build-graph
GET  /graph/visual
```

## Status

NeuraGraph currently works end-to-end locally:

- Text ingestion
- Entity extraction
- Node and edge creation
- Results panel
- Graph View
- React Flow visualization
- Custom graph nodes
- Refresh Graph behavior

# NeuraGraph Frontend

React + Vite frontend for NeuraGraph.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## API Configuration

Local development uses the Vite proxy in `vite.config.js`.

Production uses:

```text
VITE_API_BASE_URL
```

Set it to the deployed FastAPI backend URL.

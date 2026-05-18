# Frontend Tech Interview 2 — Image Gallery Uploader

Welcome! This exercise is part of the technical interview process for the **Frontend Engineer** position at Cascade, an AI-powered platform for HR teams. You'll build an image gallery application from scratch.

This is a **practical, time-boxed exercise** — not a trick question marathon. We want to see how you break down requirements, organize code, and make reasonable decisions under realistic constraints. Don't worry about pixel-perfect styling — focus on structure, correctness, and clarity.

## Quick Start

### Docker (Recommended)

```bash
docker compose up -d --build
docker compose exec app bash
```

The app will be available at `http://localhost:5173` and the mock API at `http://localhost:3001`.

### Local Setup

Requires Node 20+.

```bash
# Terminal 1 — Mock API
cd mock-api && npm install && npx tsx server.ts

# Terminal 2 — Frontend
npm install
npm run dev
```

## Mock API

The mock API is already running and serves these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/images` | List images. Supports `?q=search` and `?tag=nature` query params. |
| `GET` | `/api/images/:id` | Get a single image |
| `POST` | `/api/images` | Upload an image (multipart form: `file`, `title`, `tags`) |
| `DELETE` | `/api/images/:id` | Delete an image (~20% simulated failure rate) |
| `GET` | `/api/tags` | List all unique tags |

The API starts with 5 sample images. Sample image files are in `public/sample-images/`.

**Upload notes:** The `POST` endpoint accepts multipart form data with fields `file` (the image file), `title` (string), and `tags` (comma-separated string). The upload has a simulated 1-3 second delay.

**Delete notes:** The `DELETE` endpoint has a ~20% simulated failure rate. Your UI should handle this gracefully.

## Requirements

Build an Image Gallery with the following features. Read through all requirements before you start — you won't have time for everything, so prioritize what you tackle.

### Upload an Image
- User provides a file, title, and comma-separated tags
- Show a client-side preview immediately (before the upload finishes)
- Display upload progress and allow cancellation mid-upload
- If the upload fails, roll back and show a helpful error message

### List Images in a Grid
- Each card shows the image, title, file size (in KB), and tags
- The grid should be responsive

### Filter Images
- Filter by searching titles
- Filter by tag
- Keep filters in the URL query params (e.g., `?q=…&tag=…`) so refreshing the page restores filter state

### Delete an Image
- Optimistically remove it from the UI
- Roll back if the deletion fails (the API has a ~20% failure rate)

### Accessibility
- Provide proper labels, roles, and keyboard/focus handling
- Announce changes (uploads, errors, deletes) in a screen-reader-friendly way

### Stretch Goals (if time allows)
- Support multi-file uploads with independent progress bars
- Add drag & drop upload support
- Virtualize the grid for large image lists

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite
- SCSS is available (sass is installed) — or use inline styles, your choice

## Time Allocation

| Phase | Time |
|---|---|
| Setup + read requirements | ~5 min |
| Build | ~30 min |
| Discussion | ~5 min |

Good luck — and feel free to ask questions at any point.

# TSH Music Chamber
<img width="2456" height="1840" alt="image" src="https://github.com/user-attachments/assets/cf14096f-2799-4739-854f-83cbd5569ec0" />

A full-stack music streaming application consisting of a FastAPI backend and a React (TypeScript) frontend. The application searches for songs using the Google Custom Search API, extracts audio streams using `yt-dlp`, and plays them in a custom-styled modern UI.

## Features

- **Search & Play:** Search for any song query; the app finds the best match and streams the audio.
- **Modern UI:** Responsive, dark-themed interface built with Tailwind CSS.
- **Audio Controls:** Custom play/pause, volume, and seek bar controls.
- **Backend Processing:** Python-based audio extraction.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, yt-dlp
- **External APIs:** Google Custom Search API, YouTube (via yt-dlp)

## Prerequisites

- **Node.js** (v16+)
- **Python** (v3.9+)
- **FFmpeg** (installed and added to your system PATH)
- **Google Custom Search API Key** & **Search Engine ID (cx)**

## Setup Instructions

### 1. Backend Setup (FastAPI)

1.  Navigate to the backend directory (or root if combined).
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install fastapi uvicorn yt-dlp requests python-dotenv pydantic
    ```
4.  Create a `.env` file in the same directory as your `main.py`:
    ```env
    KEY=your_google_api_key
    cx=your_google_search_engine_id
    ```
5.  Run the server:
    ```bash
    uvicorn main:app --reload --port 8080
    ```

### 2. Frontend Setup (React)

1.  Navigate to the frontend directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure Tailwind CSS is configured.
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `KEY` | Google Custom Search JSON API Key |
| `cx` | Google Programmable Search Engine ID |

## API Endpoints

### `POST /download`

Accepts a search query and returns the direct audio URL.

**Request Body:**
```json
{
  "query": "Song Name Artist"
}

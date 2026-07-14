# Quick Setup Guide

## Step 1: Install Dependencies

Open a terminal in the project root and run:

```bash
npm install
```

This will install all required packages including:
- React and Vite (frontend)
- Express and OpenAI SDK (backend)
- concurrently (to run both servers at once)

## Step 2: Configure OpenAI API Key

1. Open the `.env` file in the project root
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```
OPENAI_API_KEY=sk-...your-actual-key...
```

You can get an API key from: https://platform.openai.com/api-keys

## Step 3: Start the Application

### Option A: Single Command (Easiest)
```bash
npm start
```

This starts both servers in one terminal:
- Backend server on http://localhost:3001
- Frontend server on http://localhost:3000

### Option B: Separate Terminals

If you prefer to see each server's output separately:

**Terminal 1 - Backend Server:**
```bash
npm run server
```
This starts the Express server on http://localhost:3001

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
This starts the Vite development server on http://localhost:3000

## Step 4: Open the App

Open your browser to: http://localhost:3000

## First Time Usage

1. Enter your name (no password required)
2. Try these example queries:
   - "What's the weather in Tokyo?"
   - "What's AAPL trading at?"
   - "Show me Pikachu"

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use, you can change them:
- Frontend: Edit `vite.config.js` (change `port: 3000`)
- Backend: Edit `server/index.js` (change `PORT`)

### OpenAI API Errors
- Make sure your API key is correct in `.env`
- Check that you have credits in your OpenAI account
- Ensure the server terminal shows "Server running on http://localhost:3001"

### CORS Errors
Make sure the backend server is running before starting the frontend.

## Available Mock Stock Symbols

- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Google)
- AMZN (Amazon)
- META (Meta/Facebook)
- TSLA (Tesla)
- NVDA (NVIDIA)
- NFLX (Netflix)

## Features to Try

1. **Multiple queries in one message**: "Get weather for London and stock price for MSFT"
2. **Edit cards on Memory Board**: Click "Edit" on any card to modify values
3. **Remove cards**: Click "×" to remove cards from Memory Board
4. **Any Pokémon**: Ask for any Pokémon by name (e.g., "Show me Charizard")
5. **Any city**: Ask for weather in any city worldwide

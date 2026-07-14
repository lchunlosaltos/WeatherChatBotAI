# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install (1 min)

```bash
npm install
```

## Step 2: Configure API Key (1 min)

1. Get your OpenAI API key: https://platform.openai.com/api-keys
2. Edit `.env` file:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

## Step 3: Start App (30 seconds)

### Option A: Single Command (Easiest!)
```bash
npm start
```
✨ Runs both servers in one terminal!

### Option B: Using Script (Windows)
```bash
start.bat
```

### Option C: Using Script (Mac/Linux)
```bash
chmod +x start.sh
./start.sh
```

### Option D: Separate Terminals
**Terminal 1:**
```bash
npm run server
```

**Terminal 2:**
```bash
npm run dev
```

## Step 4: Open & Test (2 min)

1. Open: http://localhost:3000
2. Enter your name
3. Try these:
   - "What's the weather in Tokyo?"
   - "What's AAPL trading at?"
   - "Show me Pikachu"

## ✅ You're Done!

Now explore:
- Edit cards on Memory Board (click "Edit")
- Ask about multiple things at once
- Try different cities, stocks, and Pokémon

## 📚 Learn More

- **README.md** - Full documentation
- **TESTING.md** - All features to try
- **ARCHITECTURE.md** - How it works
- **PROJECT_SUMMARY.md** - Complete overview

## 🐛 Troubleshooting

**"OpenAI API key not configured"**
→ Make sure you edited `.env` and restarted the server

**Port already in use**
→ Close other apps using port 3000 or 3001

**CORS error**
→ Make sure backend (Terminal 1) started before frontend (Terminal 2)

## 🎯 Available Stock Symbols

AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA, NFLX

## 🌍 Cities Work Worldwide

Any city name works! Examples:
- Tokyo, London, Paris, New York, Sydney, Dubai, Mumbai, etc.

## ⚡ All Pokémon Available

All 1000+ Pokémon from PokéAPI:
- Pikachu, Charizard, Bulbasaur, Mewtwo, Eevee, etc.

---

**That's it!** Have fun exploring! 🚀

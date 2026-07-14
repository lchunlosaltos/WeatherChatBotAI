# 🤖 AI Streaming UI Demo

A beautiful conversational web app built with OpenAI's function calling and streaming responses, featuring real-time interactions with weather, stock prices, and Pokémon data.

![Project Status](https://img.shields.io/badge/status-ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **🧠 AI-Powered Chat**: Natural language interface using OpenAI's GPT-4 Turbo
- **🛠️ Three Interactive Tools**:
  - 🌤️ **Weather**: Real-time weather data from Open-Meteo API (free, no API key needed)
  - 📈 **Stock Prices**: Mock stock data with historical tracking
  - ⚡ **Pokémon Cards**: Stylized cards with data from PokéAPI (free, no API key needed)
- **📋 Memory Board**: Editable dashboard on the right showing all tool results
- **👤 User Login**: Simple username-based authentication (no password required)
- **⚡ Streaming Responses**: Real-time AI responses with OpenAI function calling
- **✏️ Editable Cards**: Modify any data on the Memory Board cards inline
- **🎨 Beautiful UI**: Gradient backgrounds, smooth animations, modern design

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API key

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

Edit the `.env` file and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-...your-actual-key...
OPENAI_MODEL=gpt-4o-mini
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Start the Application

**Option A: Single command (recommended)**
```bash
npm start
```
This runs both the backend server and frontend dev server in one terminal!

**Option B: Using the startup script (Windows)**
```bash
start.bat
```

**Option C: Using the startup script (Mac/Linux)**
```bash
chmod +x start.sh
./start.sh
```

**Option D: Separate terminals**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### 4. Open the App

Navigate to: **http://localhost:3000**

That's it! 🎉

## 💬 Usage Examples

Try these queries in the chat:

**Weather Queries:**
- "What's the weather in Tokyo?"
- "Tell me the weather in New York"
- "How's the weather in London?"

**Stock Queries:**
- "What's AAPL trading at?"
- "Get stock price for MSFT"
- "Show me GOOGL stock"

**Pokémon Queries:**
- "Show me Pikachu"
- "Get Charizard"
- "Tell me about Bulbasaur"
  (Displays: image, types, height, weight, abilities, and battle stats)

**Multiple Tools:**
- "Get weather for London and stock price for MSFT"
- "Show me Pikachu and what's the weather in Tokyo?"

## Project Structure

```
SerroAIStreamUIDemo/
├── server/
│   └── index.js           # Express server with OpenAI function calling
├── src/
│   ├── components/
│   │   ├── WeatherCard.jsx      # Weather display component
│   │   ├── StockPriceCard.jsx   # Stock display component
│   │   └── PokemonCard.jsx      # Pokémon display component
│   ├── App.jsx            # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Express.js, Node.js
- **AI**: OpenAI GPT-4 with function calling
- **APIs**: 
  - Open-Meteo (weather data)
  - PokéAPI (Pokémon data)
  - Mock data (stock prices)

## 🎯 Key Features Explained

### Memory Board
- All tool results appear as **cards** on the right sidebar
- Each card is **editable** - click "Edit" to modify values inline
- Click "×" to remove cards from the board
- Changes update in real-time
- Independently scrollable from chat

### Chat Interface
- Type messages in natural language
- AI automatically determines which tool(s) to call
- Results appear both **in chat** and on **Memory Board**
- Detailed text summaries follow each card
- Smooth streaming responses with real-time updates

### Tool Integration
Each tool uses OpenAI's function calling:
1. **getWeather(city)** - Fetches real-time weather from Open-Meteo API
2. **getStockPrices(symbol, numOfMonths)** - Returns mock stock data with history
3. **getPokemonCard(name)** - Fetches Pokémon data from PokéAPI

### Available Stock Symbols
AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA, NFLX

## 📝 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[TESTING.md](TESTING.md)** - Comprehensive testing guide

## 🐛 Troubleshooting

**"OpenAI API key not configured"**
- Make sure you've added your API key to `.env`
- Restart the backend server after changing `.env`

**Port already in use**
- Frontend: Change port in `vite.config.js`
- Backend: Change PORT in `server/index.js`

**CORS errors**
- Ensure backend server is running before starting frontend

## 📄 License

MIT

## 🙏 Acknowledgments

- OpenAI for GPT-4 and function calling
- Open-Meteo for free weather API
- PokéAPI for free Pokémon data
- React and Vite for excellent developer experience

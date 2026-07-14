# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Frontend                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Chat UI   │  │ Memory Board │  │   Login UI   │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         Card Components                         │  │  │
│  │  │  WeatherCard | StockPriceCard | PokemonCard     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ HTTP/SSE                         │
│                           ▼                                  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              OpenAI Integration                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Function Calling / Streaming           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │               Tool Functions                    │  │  │
│  │  │  • getWeather()                                 │  │  │
│  │  │  • getStockPrices()                            │  │  │
│  │  │  • getPokemonCard()                            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
    │ Open-Meteo   │ │ PokéAPI     │ │ Mock Stock  │
    │   Weather    │ │  Pokémon    │ │    Data     │
    └──────────────┘ └─────────────┘ └─────────────┘
```

## Data Flow

### 1. User Sends Message

```
User types: "What's the weather in Tokyo?"
    ↓
App.jsx captures input
    ↓
Sends POST to /api/chat with messages array
```

### 2. Server Processes Request

```
Express receives POST /api/chat
    ↓
Validates OpenAI API key
    ↓
Calls OpenAI Chat Completion API
    ↓
OpenAI analyzes message and decides to call getWeather tool
    ↓
Server receives tool_calls in streaming response
    ↓
Server executes getWeather("Tokyo")
    ↓
Fetches data from Open-Meteo API
    ↓
Returns weather data
```

### 3. Server Streams Response

```
Server sends SSE (Server-Sent Events):
    ↓
data: {"type":"text","content":"I'll check..."}
data: {"type":"text","content":" the weather"}
    ↓
data: {"type":"tool_result","data":{city:"Tokyo, Japan",...}}
    ↓
data: {"type":"done"}
```

### 4. Client Processes Stream

```
App.jsx receives SSE chunks
    ↓
Parses each data: line
    ↓
Updates messages state (for text)
    ↓
Parses tool results with parseToolResult()
    ↓
Adds cards to Memory Board
    ↓
Appends detailed text to chat
```

## Component Hierarchy

```
App.jsx (Main Container)
├── LoginBox (if not logged in)
│   └── Login Form
└── Main Interface (if logged in)
    ├── Header
    │   ├── Title
    │   └── User Info
    │       └── Logout Button
    ├── Chat Section
    │   ├── Messages Container
    │   │   └── Message[]
    │   │       ├── Text Content
    │   │       └── Tool Results (inline cards)
    │   │           ├── WeatherCard
    │   │           ├── StockPriceCard
    │   │           └── PokemonCard
    │   └── Input Container
    │       ├── Text Input
    │       └── Send Button
    └── Memory Board
        └── Memory Cards[]
            ├── WeatherCard (editable)
            ├── StockPriceCard (editable)
            └── PokemonCard (editable)
```

## State Management

### App.jsx State

```javascript
{
  username: string,           // Current user's name
  isLoggedIn: boolean,        // Login status
  messages: Array<{           // Chat history
    role: 'user' | 'assistant',
    content: string,
    toolResults?: Array<{...}>
  }>,
  input: string,              // Current input text
  isLoading: boolean,         // Request in progress
  memoryCards: Array<{        // Cards on Memory Board
    id: number,
    type: 'weather' | 'stock' | 'pokemon',
    data: {...}
  }>
}
```

### Card Component Props

```javascript
{
  data: Object,              // The card data
  onUpdate: Function,        // Called when edited (editable mode)
  onRemove: Function,        // Called when removed (editable mode)
  editable: boolean,         // Enable edit/remove buttons
  inline: boolean           // Compact mode for chat display
}
```

## API Endpoints

### POST /api/chat

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What's the weather in Tokyo?" }
  ]
}
```

**Response (SSE Stream):**
```
data: {"type":"text","content":"Let me check"}
data: {"type":"tool_result","data":{...weatherData...}}
data: {"type":"done"}
```

## OpenAI Function Calling

### Tool Definitions

```javascript
{
  type: 'function',
  function: {
    name: 'getWeather',
    description: 'Get the current weather for a city',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: '...' }
      },
      required: ['city']
    }
  }
}
```

### Execution Flow

1. OpenAI decides to call a function
2. Returns tool_calls in stream
3. Server collects function name + arguments
4. Server executes corresponding function
5. Server sends result back as tool_result
6. Client parses and displays result

## External APIs

### 1. Open-Meteo API

**Geocoding:**
```
GET https://geocoding-api.open-meteo.com/v1/search?name={city}
```

**Weather:**
```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...
```

### 2. PokéAPI

**Get Pokémon:**
```
GET https://pokeapi.co/api/v2/pokemon/{name}
```

### 3. Mock Stock Data

Generated locally with random variations based on predefined stock data.

## Styling Architecture

### Global Styles (index.css)
- CSS Reset
- Global layout
- Utility classes
- Scrollbar styling

### Component Styles
- Inline styles in JSX
- Dynamic styles based on props/state
- Gradient backgrounds
- Responsive design

### Color Scheme

**Primary:**
- Purple Gradient: `#667eea` → `#764ba2`

**Weather Cards:**
- Blue/Purple Gradient

**Stock Cards:**
- Green Gradient: `#11998e` → `#38ef7d`

**Pokémon Cards:**
- Type-based colors (fire: `#F08030`, water: `#6890F0`, etc.)

## Performance Considerations

1. **Streaming**: Uses SSE for real-time updates
2. **Component Updates**: React state batching for smooth rendering
3. **Memory Management**: Cards stored in lightweight state
4. **API Caching**: None (real-time data prioritized)
5. **Error Handling**: Graceful degradation on API failures

## Security Considerations

1. **API Key**: Stored in `.env`, never exposed to client
2. **CORS**: Enabled for localhost development
3. **Input Validation**: Server-side validation of tool parameters
4. **Rate Limiting**: None (add for production)
5. **Authentication**: Simple username (no password - add for production)

## Scalability Notes

**Current Implementation:**
- Single user
- No persistence
- In-memory state
- Local storage not used

**For Production:**
- Add user authentication
- Add database for persistence
- Add session management
- Add rate limiting
- Add error logging
- Add monitoring
- Deploy backend separately
- Add WebSocket for better streaming

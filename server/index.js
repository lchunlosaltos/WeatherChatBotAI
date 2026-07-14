import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const app = express();
app.use(cors());
app.use(express.json());

// Mock stock data - In production, this would come from a real stock API
const MOCK_STOCKS = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.34, changePercent: 1.25 },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.50, change: -1.20, changePercent: -0.29 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: 0.85, changePercent: 0.61 },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 3.12, changePercent: 1.78 },
  META: { symbol: 'META', name: 'Meta Platforms Inc.', price: 512.80, change: -2.45, changePercent: -0.48 },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 5.67, changePercent: 2.33 },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  NFLX: { symbol: 'NFLX', name: 'Netflix Inc.', price: 625.90, change: -4.23, changePercent: -0.67 },
  default: { symbol: 'UNKNOWN', name: 'Unknown', price: 100.00, change: 0, changePercent: 0 },
};

// Tool 1: Get weather data using Open-Meteo API (free, no API key required)
async function getWeather(city) {
  try {
    // First, geocode the city name to get coordinates
    const geocodeResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      return { error: `Could not find location: ${city}` };
    }

    const { latitude, longitude, name, country } = geocodeData.results[0];
    
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );
    const weatherData = await weatherResponse.json();
    
    const weatherCodes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Moderate drizzle',
      55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Rain showers',
      81: 'Moderate rain showers', 82: 'Violent rain showers', 95: 'Thunderstorm'
    };

    return {
      city: `${name}, ${country}`,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      condition: weatherCodes[weatherData.current.weather_code] || 'Unknown',
      unit: weatherData.current_units.temperature_2m
    };
  } catch (error) {
    return { error: `Failed to fetch weather data: ${error.message}` };
  }
}

// Tool 2: Get stock prices (mock data with generated historical prices)
function getStockPrices(symbol, numOfMonths = 1) {
  const stockData = MOCK_STOCKS[symbol.toUpperCase()] || MOCK_STOCKS.default;
  
  // Generate mock historical data
  const historicalData = [];
  const basePrice = stockData.price;
  const today = new Date();
  
  for (let i = numOfMonths * 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const randomVariation = (Math.random() - 0.5) * 20;
    const price = Math.max(basePrice + randomVariation, 1);
    
    historicalData.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return {
    ...stockData,
    historicalData,
    numOfMonths
  };
}

// Tool 3: Get Pokémon data using PokéAPI (free, no API key required)
async function getPokemonCard(name) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    
    if (!response.ok) {
      return { error: `Could not find Pokémon: ${name}` };
    }
    
    const data = await response.json();
    
    return {
      name: data.name,
      id: data.id,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map(a => a.ability.name),
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      }))
    };
  } catch (error) {
    return { error: `Failed to fetch Pokémon data: ${error.message}` };
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please add your API key to the .env file.' 
      });
    }
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Define OpenAI function calling tools
    const tools = [
      {
        type: 'function',
        function: {
          name: 'getWeather',
          description: 'Get the current weather for a city',
          parameters: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: 'The city name to get weather for'
              }
            },
            required: ['city']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'getStockPrices',
          description: 'Get stock prices and historical data for a stock symbol',
          parameters: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol (e.g., AAPL, MSFT, GOOGL)'
              },
              numOfMonths: {
                type: 'number',
                description: 'Number of months of historical data to retrieve',
                default: 1
              }
            },
            required: ['symbol']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'getPokemonCard',
          description: 'Get detailed information about a Pokémon',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the Pokémon'
              }
            },
            required: ['name']
          }
        }
      }
    ];

    // Call OpenAI with streaming enabled
    const stream = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      tools: tools,
      tool_choice: 'auto', // Let AI decide when to call functions
      stream: true,
    });

    // Track function calls as they stream in
    let functionCalls = new Map();
    let currentFunctionCall = null;

    // Process the streaming response
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      // Stream text content to client
      if (delta?.content) {
        res.write(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`);
      }

      if (delta?.tool_calls) {
        for (const toolCall of delta.tool_calls) {
          if (!currentFunctionCall || currentFunctionCall.index !== toolCall.index) {
            if (currentFunctionCall) {
              functionCalls.set(currentFunctionCall.id, currentFunctionCall);
            }
            currentFunctionCall = {
              index: toolCall.index,
              id: toolCall.id,
              name: toolCall.function?.name || '',
              arguments: toolCall.function?.arguments || '',
            };
          } else {
            if (toolCall.function?.name) {
              currentFunctionCall.name += toolCall.function.name;
            }
            if (toolCall.function?.arguments) {
              currentFunctionCall.arguments += toolCall.function.arguments;
            }
          }
        }
      }

      if (chunk.choices[0]?.finish_reason === 'tool_calls') {
        if (currentFunctionCall) {
          functionCalls.set(currentFunctionCall.id, currentFunctionCall);
        }
      }
    }

    // Execute all function calls and send results
    const toolMessages = [];
    const toolNames = [];
    
    for (const [id, functionCall] of functionCalls) {
      const { name, arguments: argsString } = functionCall;
      const args = JSON.parse(argsString);
      
      toolNames.push(name);
      
      let result;
      // Route to appropriate tool function
      if (name === 'getWeather') {
        result = await getWeather(args.city);
      } else if (name === 'getStockPrices') {
        result = getStockPrices(args.symbol, args.numOfMonths || 1);
      } else if (name === 'getPokemonCard') {
        result = await getPokemonCard(args.name);
      }

      // Send tool result to client
      if (result) {
        res.write(`data: ${JSON.stringify({ type: 'tool_result', data: result })}\n\n`);
        
        // Prepare tool message for follow-up response
        toolMessages.push({
          tool_call_id: id,
          role: 'tool',
          name: name,
          content: JSON.stringify(result)
        });
      }
    }

    // Check if all tool calls are for Pokémon (skip follow-up text for Pokémon-only requests)
    const isPokemonOnly = toolNames.length > 0 && toolNames.every(name => name === 'getPokemonCard');

    // If tools were called and it's not Pokémon-only, make a second call to get AI's response
    if (functionCalls.size > 0 && !isPokemonOnly) {
      // Build the conversation with tool results
      const followUpMessages = [
        ...messages,
        {
          role: 'assistant',
          tool_calls: Array.from(functionCalls.values()).map(fc => ({
            id: fc.id,
            type: 'function',
            function: {
              name: fc.name,
              arguments: fc.arguments
            }
          }))
        },
        ...toolMessages
      ];

      // Get AI's response about the tool results
      const followUpStream = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: followUpMessages,
        stream: true,
      });

      // Stream the AI's response
      for await (const chunk of followUpStream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          res.write(`data: ${JSON.stringify({ type: 'text', content: delta.content })}\n\n`);
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

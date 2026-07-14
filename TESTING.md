# Testing Guide

## Test Scenarios

### 1. Weather Tool Tests

Test the `getWeather` function with various cities:

```
✅ "What's the weather in Tokyo?"
✅ "Tell me the weather in New York"
✅ "How's the weather in London?"
✅ "Weather for Paris"
✅ "Get weather data for Sydney"
```

Expected behavior:
- Weather card appears in chat
- Card is added to Memory Board
- Details show: temperature, humidity, wind speed, condition
- Weather icon matches condition (☀️ for clear, 🌧️ for rain, etc.)

### 2. Stock Tool Tests

Test the `getStockPrices` function with various symbols:

```
✅ "What's AAPL trading at?"
✅ "Get stock price for MSFT"
✅ "Show me GOOGL stock"
✅ "Stock price for TSLA"
✅ "How much is NVDA?"
```

Expected behavior:
- Stock card appears in chat
- Card is added to Memory Board
- Shows: company name, symbol, current price, change, change percent
- Green indicator for positive change, red for negative
- Historical data note appears

### 3. Pokémon Tool Tests

Test the `getPokemonCard` function with various Pokémon:

```
✅ "Show me Pikachu"
✅ "Get Charizard"
✅ "Tell me about Bulbasaur"
✅ "Show Mewtwo"
✅ "I want to see Eevee"
```

Expected behavior:
- Pokémon card appears in chat
- Card is added to Memory Board
- Shows: image, name, ID number, types, height, weight, abilities, and battle stats
- Card color matches primary type
- Type badges display correctly
- Battle stats display with color-coded progress bars (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)

### 4. Multiple Tool Calls

Test handling multiple tools in one query:

```
✅ "What's the weather in Tokyo and AAPL stock price?"
✅ "Show me Pikachu and get weather for London"
✅ "Get MSFT stock and show me Charizard"
```

Expected behavior:
- Both cards appear in chat
- Both cards added to Memory Board
- Each has appropriate details in text

### 5. Memory Board Editing

Test the editing functionality:

**Weather Cards:**
1. Get a weather card
2. Click "Edit" button
3. Modify temperature, humidity, or condition
4. Click "Save"
5. Verify changes are reflected
6. Note: City name is NOT editable

**Stock Cards:**
1. Get a stock card
2. Click "Edit" button
3. Modify price or change value
4. Click "Save"
5. Note: Symbol and company name are NOT editable

**Pokémon Cards:**
1. Get a Pokémon card
2. Click "Edit" button
3. Modify types or stat values (HP, Attack, etc.)
4. Click "Save"
5. Note: Name, ID, and image are NOT editable

Expected behavior:
- Edit mode shows input fields for editable values
- Non-editable fields display as text
- Save persists changes and shows **✏️ Edited** badge
- Cancel reverts changes (no badge appears)
- Remove (×) deletes the card
- Edited badge appears on Weather/Stock cards (top-left)
- Edited badge appears on Pokémon cards (top, next to ID number)

### 6. Error Handling

Test error scenarios:

```
❌ "What's the weather in InvalidCityName12345?"
❌ "Show me InvalidPokémonName12345"
❌ "Get stock price for INVALID"
```

Expected behavior:
- Error message appears in chat
- Error card shows (if applicable)
- App doesn't crash
- User can continue chatting

### 7. User Authentication

Test login flow:

1. Open app
2. See login screen
3. Enter username
4. Click "Start Chat"
5. See chat interface
6. Click "Logout"
7. Return to login screen

Expected behavior:
- Login required on first visit
- Username displays in header
- Logout clears session
- Messages cleared on logout

### 8. Streaming Responses

Test real-time streaming:

```
✅ "Tell me about the weather in multiple cities"
```

Expected behavior:
- Text appears progressively (not all at once)
- Smooth streaming experience
- Tool results appear after text completion
- No flickering or UI jumps

### 9. UI/UX Tests

Visual and interaction tests:

- ✅ Cards have proper styling
- ✅ Memory Board scrolls when full
- ✅ Chat scrolls automatically to bottom
- ✅ Input field clears after sending
- ✅ Send button disabled while loading
- ✅ Responsive layout works
- ✅ Colors are readable
- ✅ Animations are smooth

### 10. Edge Cases

Test unusual scenarios:

```
✅ Empty message (should not send)
✅ Very long city name
✅ Pokémon name with special characters
✅ Multiple rapid requests
✅ Navigating away during request
```

## Performance Tests

### Load Testing
- Add 20+ cards to Memory Board
- Verify smooth scrolling
- Check memory usage

### Network Testing
- Test with slow connection
- Test with interrupted connection
- Verify error handling

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Checklist

Before considering testing complete:

- [ ] All weather queries work
- [ ] All stock queries work
- [ ] All Pokémon queries work
- [ ] Multiple tools in one query work
- [ ] Memory Board cards are editable
- [ ] Memory Board cards are removable
- [ ] Login/logout flow works
- [ ] Error handling works
- [ ] Streaming is smooth
- [ ] UI is responsive
- [ ] No console errors
- [ ] No visual glitches

## Known Limitations

1. Stock prices are mock data (not real-time)
2. Historical stock data is randomly generated
3. Weather data updates in real-time from Open-Meteo
4. Pokémon data is from PokéAPI (comprehensive)
5. No persistent storage (refresh clears data)
6. One user at a time (no multi-user support)

## Reporting Issues

If you find bugs:
1. Note the exact query used
2. Check browser console for errors
3. Check server terminal for errors
4. Note expected vs actual behavior
5. Include screenshots if relevant

import { useState, useRef, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import StockPriceCard from './components/StockPriceCard';
import PokemonCard from './components/PokemonCard';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setMessages([]);
    setMemoryCards([]);
  };

  const parseToolResult = (data) => {
    if (data.city && data.temperature !== undefined) {
      return { type: 'weather', data };
    }
    if (data.symbol && data.price !== undefined) {
      return { type: 'stock', data };
    }
    if (data.name && data.types && data.image) {
      return { type: 'pokemon', data };
    }
    return { type: 'text', data };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let toolResults = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'text') {
                assistantMessage += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage;
                    // Keep existing toolResults if any
                    if (toolResults.length > 0) {
                      lastMessage.toolResults = [...toolResults];
                    }
                  } else {
                    newMessages.push({ 
                      role: 'assistant', 
                      content: assistantMessage,
                      toolResults: toolResults.length > 0 ? [...toolResults] : undefined
                    });
                  }
                  return newMessages;
                });
              } else if (data.type === 'tool_result') {
                const parsed = parseToolResult(data.data);
                toolResults.push(parsed);
                
                // Add to memory board
                if (parsed.type !== 'text') {
                  setMemoryCards(prev => [...prev, { id: Date.now() + Math.random(), ...parsed }]);
                }
                
                // Immediately update the message with the new tool result
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.toolResults = [...toolResults];
                  } else {
                    newMessages.push({ 
                      role: 'assistant', 
                      content: assistantMessage,
                      toolResults: [...toolResults]
                    });
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemoryCard = (id, newData) => {
    setMemoryCards(prev => prev.map(card => 
      card.id === id ? { ...card, data: { ...card.data, ...newData }, isEdited: true } : card
    ));
  };

  const removeMemoryCard = (id) => {
    setMemoryCards(prev => prev.filter(card => card.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome</h1>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Enter your name to start chatting with AI
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <button type="submit">Start Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Streaming Chat</h1>
        <div className="user-info">
          <span>Welcome, {username}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="chat-section">
          <div className="messages-container">
            {messages.length === 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '600px',
                margin: '2rem auto',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                <h2 style={{ 
                  color: '#667eea', 
                  marginBottom: '1.5rem',
                  fontSize: '1.75rem',
                  textAlign: 'center'
                }}>
                  👋 Welcome! Try asking me about:
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    color: 'white',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌤️</div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Weather</h3>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                      Get real-time weather for any city
                    </p>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      "What's the weather in Tokyo?"
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    color: 'white',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Stock Prices</h3>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                      Check stock prices (AAPL, MSFT, GOOGL, TSLA, etc.)
                    </p>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      "What's AAPL trading at?"
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    color: 'white',
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Pokémon Cards</h3>
                    <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                      Discover any Pokémon with stats and abilities
                    </p>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      "Show me Pikachu"
                    </div>
                  </div>
                </div>

                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '1.5rem', 
                  color: '#666',
                  fontSize: '0.95rem'
                }}>
                  💡 You can also ask about multiple things at once!
                </p>
              </div>
            )}

            {messages.map((message, index) => {
              // Check if this message has only Pokémon results
              const hasPokemonOnly = message.toolResults?.length > 0 && 
                message.toolResults.every(result => result.type === 'pokemon');
              
              // Hide text content if message contains only Pokémon cards
              const shouldShowText = message.content && !hasPokemonOnly;
              
              return (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  {message.toolResults && message.toolResults.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: shouldShowText ? '1rem' : '0' }}>
                      {message.toolResults.map((result, idx) => {
                        if (result.type === 'weather') {
                          return <WeatherCard key={idx} data={result.data} inline />;
                        } else if (result.type === 'stock') {
                          return <StockPriceCard key={idx} data={result.data} inline />;
                        } else if (result.type === 'pokemon') {
                          return <PokemonCard key={idx} data={result.data} inline />;
                        }
                        return null;
                      })}
                    </div>
                  )}
                  {shouldShowText && (
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={messages.length === 0 
                ? "Try: What's the weather in Tokyo?" 
                : "Ask about weather, stocks, or Pokémon..."}
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </section>

        <aside className="memory-board">
          <h2>Memory Board</h2>
          <div className="memory-cards">
            {memoryCards.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>
                No cards yet. Try asking about weather, stocks, or Pokémon!
              </p>
            ) : (
              memoryCards.map((card) => (
                <div key={card.id}>
                  {card.type === 'weather' && (
                    <WeatherCard 
                      data={card.data} 
                      onUpdate={(newData) => updateMemoryCard(card.id, newData)}
                      onRemove={() => removeMemoryCard(card.id)}
                      editable
                      isEdited={card.isEdited}
                    />
                  )}
                  {card.type === 'stock' && (
                    <StockPriceCard 
                      data={card.data} 
                      onUpdate={(newData) => updateMemoryCard(card.id, newData)}
                      onRemove={() => removeMemoryCard(card.id)}
                      editable
                      isEdited={card.isEdited}
                    />
                  )}
                  {card.type === 'pokemon' && (
                    <PokemonCard 
                      data={card.data} 
                      onUpdate={(newData) => updateMemoryCard(card.id, newData)}
                      onRemove={() => removeMemoryCard(card.id)}
                      editable
                      isEdited={card.isEdited}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;

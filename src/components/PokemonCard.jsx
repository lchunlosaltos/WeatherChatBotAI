import { useState } from 'react';

function PokemonCard({ data, onUpdate, onRemove, editable, inline, isEdited }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  const primaryType = editData.types?.[0] || 'normal';
  const backgroundColor = typeColors[primaryType] || '#A8A878';

  const cardStyle = {
    background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
    borderRadius: '16px',
    padding: '1.5rem',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    minWidth: inline ? '300px' : 'auto',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '0.5rem',
    color: 'white',
    width: '100%',
    marginBottom: '0.5rem',
  };

  if (data.error) {
    return (
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <h3>Error</h3>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {isEdited && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '80px',
          background: 'rgba(255, 255, 255, 0.3)',
          padding: '0.25rem 0.5rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          zIndex: 10,
        }}>
          ✏️ Edited
        </div>
      )}
      {editable && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Edit
              </button>
              <button 
                onClick={onRemove}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                ×
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleSave}
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                Save
              </button>
              <button 
                onClick={handleCancel}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        {isEditing ? (
          <>
            <div style={{ 
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}>
              #{String(editData.id).padStart(3, '0')}
            </div>
            
            <img 
              src={editData.image} 
              alt={editData.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                margin: '1rem auto',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
              }}
            />

            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              textTransform: 'capitalize',
            }}>
              {editData.name}
            </h3>

            <input 
              style={inputStyle}
              value={editData.types?.join(', ')}
              onChange={(e) => setEditData({ ...editData, types: e.target.value.split(',').map(t => t.trim()) })}
              placeholder="Types (comma separated)"
            />

            {editData.stats && editData.stats.length > 0 && (
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stats:</div>
                {editData.stats.map((stat, idx) => {
                  const statNames = {
                    'hp': 'HP',
                    'attack': 'Attack',
                    'defense': 'Defense',
                    'special-attack': 'Sp. Atk',
                    'special-defense': 'Sp. Def',
                    'speed': 'Speed'
                  };
                  
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <label style={{ 
                        minWidth: '70px', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}>
                        {statNames[stat.name] || stat.name}:
                      </label>
                      <input 
                        style={{
                          ...inputStyle,
                          marginBottom: 0,
                          flex: 1,
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.875rem'
                        }}
                        type="number"
                        min="0"
                        max="255"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...editData.stats];
                          newStats[idx] = { ...stat, value: parseInt(e.target.value) || 0 };
                          setEditData({ ...editData, stats: newStats });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ 
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}>
              #{String(editData.id).padStart(3, '0')}
            </div>

            <img 
              src={editData.image} 
              alt={editData.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                margin: '1rem auto',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
              }}
            />

            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              textTransform: 'capitalize',
            }}>
              {editData.name}
            </h3>

            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              {editData.types?.map((type, idx) => (
                <span 
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </span>
              ))}
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.875rem',
              marginTop: '1rem',
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ opacity: 0.8 }}>Height</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{editData.height}m</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ opacity: 0.8 }}>Weight</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{editData.weight}kg</div>
              </div>
            </div>

            {editData.abilities && (
              <div style={{ 
                marginTop: '1rem',
                fontSize: '0.875rem',
                opacity: 0.9,
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Abilities:</div>
                <div style={{ textTransform: 'capitalize' }}>
                  {editData.abilities?.join(', ').replace(/-/g, ' ')}
                </div>
              </div>
            )}

            {editData.stats && editData.stats.length > 0 && (
              <div style={{ 
                marginTop: '1rem',
                fontSize: '0.875rem',
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Stats:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {editData.stats.map((stat, idx) => {
                    const maxStat = 255;
                    const percentage = (stat.value / maxStat) * 100;
                    const statNames = {
                      'hp': 'HP',
                      'attack': 'Attack',
                      'defense': 'Defense',
                      'special-attack': 'Sp. Atk',
                      'special-defense': 'Sp. Def',
                      'speed': 'Speed'
                    };
                    
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          minWidth: '65px', 
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textAlign: 'right',
                          opacity: 0.9
                        }}>
                          {statNames[stat.name] || stat.name}
                        </div>
                        <div style={{ 
                          flex: 1, 
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '4px',
                          height: '18px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: stat.value >= 100 
                              ? 'rgba(46, 204, 113, 0.8)' 
                              : stat.value >= 70 
                                ? 'rgba(52, 152, 219, 0.8)'
                                : 'rgba(241, 196, 15, 0.8)',
                            height: '100%',
                            width: `${percentage}%`,
                            transition: 'width 0.3s ease',
                            borderRadius: '4px'
                          }} />
                        </div>
                        <div style={{ 
                          minWidth: '35px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textAlign: 'left'
                        }}>
                          {stat.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PokemonCard;

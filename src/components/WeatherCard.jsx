import { useState } from 'react';

function WeatherCard({ data, onUpdate, onRemove, editable, inline, isEdited }) {
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

  const cardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          left: '10px',
          background: 'rgba(255, 255, 255, 0.3)',
          padding: '0.25rem 0.5rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          ✏️ Edited
        </div>
      )}
      {editable && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
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

      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        {editData.condition?.includes('rain') || editData.condition?.includes('Rain') ? '🌧️' : 
         editData.condition?.includes('cloud') || editData.condition?.includes('Cloud') ? '☁️' :
         editData.condition?.includes('snow') || editData.condition?.includes('Snow') ? '❄️' :
         editData.condition?.includes('clear') || editData.condition?.includes('Clear') ? '☀️' : '🌤️'}
      </div>

      {isEditing ? (
        <>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {editData.city}
          </h3>
          <input 
            style={inputStyle}
            type="number"
            value={editData.temperature}
            onChange={(e) => setEditData({ ...editData, temperature: parseFloat(e.target.value) })}
            placeholder="Temperature"
          />
          <input 
            style={inputStyle}
            type="number"
            value={editData.humidity}
            onChange={(e) => setEditData({ ...editData, humidity: parseFloat(e.target.value) })}
            placeholder="Humidity"
          />
          <input 
            style={inputStyle}
            value={editData.condition}
            onChange={(e) => setEditData({ ...editData, condition: e.target.value })}
            placeholder="Condition"
          />
        </>
      ) : (
        <>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            {editData.city}
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {editData.temperature}°{editData.unit?.replace('°', '')}
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem', opacity: 0.9 }}>
            {editData.condition}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            opacity: 0.9,
          }}>
            <div>💧 Humidity: {editData.humidity}%</div>
            <div>💨 Wind: {editData.windSpeed} km/h</div>
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherCard;

import { useState } from 'react';

function StockPriceCard({ data, onUpdate, onRemove, editable, inline, isEdited }) {
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

  const isPositive = editData.change >= 0;
  
  const cardStyle = {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
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

      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        📈
      </div>

      {isEditing ? (
        <>
          <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.25rem' }}>
            {editData.symbol}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>
            {editData.name}
          </div>
          <input 
            style={inputStyle}
            type="number"
            step="0.01"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
            placeholder="Price"
          />
          <input 
            style={inputStyle}
            type="number"
            step="0.01"
            value={editData.change}
            onChange={(e) => setEditData({ ...editData, change: parseFloat(e.target.value) })}
            placeholder="Change"
          />
        </>
      ) : (
        <>
          <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.25rem' }}>
            {editData.symbol}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>
            {editData.name}
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ${editData.price.toFixed(2)}
          </div>
          <div style={{ 
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>
              {isPositive ? '📈' : '📉'}
            </span>
            <span style={{ 
              background: isPositive ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}>
              {isPositive ? '+' : ''}{editData.change.toFixed(2)} ({isPositive ? '+' : ''}{editData.changePercent.toFixed(2)}%)
            </span>
          </div>
          {editData.historicalData && (
            <div style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.875rem' }}>
              Historical data: {editData.numOfMonths} month{editData.numOfMonths > 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StockPriceCard;

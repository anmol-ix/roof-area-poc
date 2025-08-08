import React from 'react';

const SearchBar = ({ 
  address, 
  setAddress, 
  onGeocode, 
  isGeocoding, 
  error 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onGeocode();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
        border: '1px solid rgba(255, 255, 255, 0.2)', 
        padding: '24px',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a U.S. address..."
              disabled={isGeocoding}
              style={{ 
                flex: '1', 
                minWidth: '300px',
                padding: '16px 20px', 
                border: '2px solid transparent', 
                borderRadius: '12px', 
                fontSize: '16px',
                fontWeight: '400',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                cursor: isGeocoding ? 'not-allowed' : 'text',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: '#1f2937'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            />
            <button
              onClick={onGeocode}
              disabled={isGeocoding || !address.trim()}
              style={{
                padding: '16px 32px',
                background: (isGeocoding || !address.trim()) 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isGeocoding || !address.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '140px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (!isGeocoding && address.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
              }}
            >
              {isGeocoding ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Searching...
                </div>
              ) : (
                '🔍 Find Location'
              )}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              color: '#dc2626', 
              fontSize: '14px', 
              backgroundColor: 'rgba(254, 242, 242, 0.9)', 
              border: '1px solid #fecaca', 
              borderRadius: '12px', 
              padding: '12px 16px',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 6px rgba(220, 38, 38, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ fontWeight: '500' }}>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
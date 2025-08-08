import React from 'react';

const InfoPanel = ({ 
  pin, 
  buildingFootprint, 
  roofArea, 
  isLoading, 
  error 
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderRadius: '20px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
        border: '1px solid rgba(255, 255, 255, 0.3)', 
        padding: '28px',
        maxHeight: '500px',
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
          }}>
            🏗️
          </div>
          <div>
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: '#1f2937', 
              margin: '0',
              letterSpacing: '-0.5px'
            }}>
              Building Analytics
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '4px 0 0 0',
              fontWeight: '500'
            }}>
              Roof Area Calculator
            </p>
          </div>
        </div>
        
        {isLoading && (
          <div style={{ 
            color: '#2563eb', 
            fontSize: '14px', 
            backgroundColor: '#eff6ff', 
            border: '1px solid #bfdbfe', 
            borderRadius: '6px', 
            padding: '12px', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            🔄 Analyzing building...
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#dc2626', 
            fontSize: '14px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '6px', 
            padding: '12px' 
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {!pin && !isLoading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: '16px',
            border: '2px dashed rgba(99, 102, 241, 0.3)'
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              animation: 'pulse 2s infinite'
            }}>
              🎯
            </div>
            <h4 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#374151', 
              margin: '0 0 8px 0' 
            }}>
              Ready to Analyze
            </h4>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              margin: '0',
              lineHeight: '1.5'
            }}>
              Click on any building to calculate its roof area
            </p>
          </div>
        )}
        
        {pin && !isLoading && !error && !roofArea && (
          <div style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            textAlign: 'center', 
            padding: '16px 0' 
          }}>
            🏠 No building found at this location
          </div>
        )}
        
        {roofArea && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Main Result Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              borderRadius: '20px', 
              padding: '24px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500' }}>
                  📏 Calculated Roof Area
                </div>
                <h4 style={{ 
                  fontSize: '36px', 
                  fontWeight: '800', 
                  margin: '0',
                  letterSpacing: '-1px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {roofArea.area.toLocaleString()}
                </h4>
                <div style={{ fontSize: '18px', opacity: '0.9', marginTop: '4px', fontWeight: '600' }}>
                  square meters
                </div>
              </div>
            </div>
            
            {/* Details Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Source</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginTop: '4px' }}>
                  {buildingFootprint?.properties?.source || 'Unknown'}
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precision</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginTop: '4px' }}>
                  {roofArea.precision}
                </div>
              </div>
            </div>
            
            {/* Method */}
            <div style={{
              padding: '16px',
              background: 'rgba(245, 245, 245, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Calculation Method</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                {roofArea.calculation_method}
              </div>
            </div>
            
            {/* Coordinates */}
            {pin && (
              <div style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Location Coordinates</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'monospace' }}>
                  <span style={{ color: '#374151', fontWeight: '600' }}>Lat: {pin.latitude.toFixed(6)}</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>Lon: {pin.longitude.toFixed(6)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
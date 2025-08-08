import React from 'react';

const MobileInfoPanel = ({ 
  pin, 
  buildingFootprint, 
  roofArea, 
  isLoading, 
  error 
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        📐 Building Information
      </h3>
      
      {isLoading && (
        <div className="text-blue-600 text-sm bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          🔄 Analyzing building...
        </div>
      )}
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
          ⚠️ {error}
        </div>
      )}
      
      {!pin && !isLoading && !error && (
        <div className="text-gray-500 text-sm text-center py-4">
          📍 Click on a building to get started
        </div>
      )}
      
      {pin && !isLoading && !error && !roofArea && (
        <div className="text-gray-500 text-sm text-center py-4">
          🏠 No building found at this location
        </div>
      )}
      
      {roofArea && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <h4 className="text-2xl font-semibold text-green-800 mb-1">
              {roofArea.area.toLocaleString()} m²
            </h4>
            <p className="text-sm text-green-600">Roof Area</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block">Source:</span>
              <span className="font-medium text-gray-900">
                {buildingFootprint?.properties?.source || 'Unknown'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600 block">Method:</span>
              <span className="font-medium text-gray-900 text-xs">
                {roofArea.calculation_method}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600 block">Precision:</span>
              <span className="font-medium text-gray-900">
                {roofArea.precision}
              </span>
            </div>
            
            {pin && (
              <div>
                <span className="text-gray-600 block">Coordinates:</span>
                <div className="text-xs text-gray-500">
                  <div>{pin.latitude.toFixed(4)}</div>
                  <div>{pin.longitude.toFixed(4)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileInfoPanel;
import { useState } from 'react';

const DebugPanel = ({ data, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-400 font-mono text-sm font-bold"
      >
        🐛 Debug {label}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-auto bg-gray-900 text-green-400 p-4 rounded-lg shadow-2xl border-2 border-yellow-500 font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-yellow-400">Debug: {label}</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-yellow-400">Type:</span>{' '}
              <span className="text-cyan-400">
                {Array.isArray(data) ? `Array[${data.length}]` : typeof data}
              </span>
            </div>
            
            <div>
              <span className="text-yellow-400">Keys:</span>{' '}
              <span className="text-cyan-400">
                {data && typeof data === 'object' 
                  ? Object.keys(data).join(', ') 
                  : 'N/A'}
              </span>
            </div>
            
            <div className="mt-2">
              <span className="text-yellow-400">Raw Data:</span>
              <pre className="mt-1 p-2 bg-black rounded text-green-300 overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;

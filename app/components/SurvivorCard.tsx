'use client';

import type { Survivor } from '../page';

export default function SurvivorCard({ 
  survivor, 
  isSelected,
  onClick 
}: { 
  survivor: Survivor;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      className={`survivor-card min-w-[240px] max-w-[260px] bg-gray-700 rounded-lg p-4 border transition-all duration-200 ${
        isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
      }`}
      onClick={onClick}
    >
      <div className="survivor-header flex items-center mb-3">
        <div className="survivor-avatar w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 font-bold text-lg">
          {survivor.name.charAt(0)}
        </div>
        <div>
          <h3 className="survivor-name font-bold">{survivor.name}</h3>
          <p className="survivor-profession text-sm text-gray-300">{survivor.profession} • {survivor.personality}</p>
        </div>
      </div>
      
      <div className="stat-bar mb-2">
        <div className="stat-label flex justify-between text-xs mb-1">
          <span>Life:</span>
          <span>{survivor.life} days</span>
        </div>
        <div className="stat-fill h-2 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="stat-fill-value life bg-red-500 h-full rounded-full" 
            style={{ width: `${(survivor.life / 100) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat-bar mb-2">
        <div className="stat-label flex justify-between text-xs mb-1">
          <span>Hope:</span>
          <span>{survivor.hope}%</span>
        </div>
        <div className="stat-fill h-2 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="stat-fill-value hope bg-green-500 h-full rounded-full" 
            style={{ width: `${survivor.hope}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat-bar mb-3">
        <div className="stat-label flex justify-between text-xs mb-1">
          <span>Trust:</span>
          <span>{survivor.trust}%</span>
        </div>
        <div className="stat-fill h-2 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="stat-fill-value trust bg-blue-500 h-full rounded-full" 
            style={{ width: `${survivor.trust}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-sm italic text-gray-300 mb-2">"{survivor.dream}"</p>
      <p className="text-xs text-gray-400">Destination: {survivor.destination}</p>
    </div>
  );
}

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
      className={`survivor-card ${isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}`}
      onClick={onClick}
    >
      <div className="survivor-header">
        <div className="survivor-avatar">
          {survivor.name.charAt(0)}
        </div>
        <div>
          <h3 className="survivor-name">{survivor.name}</h3>
          <p className="survivor-profession">{survivor.profession} • {survivor.personality}</p>
        </div>
      </div>
      
      <div className="stat-bar">
        <div className="stat-label">
          <span>Life:</span>
          <span>{survivor.life} days</span>
        </div>
        <div className="stat-fill">
          <div 
            className="stat-fill-value life" 
            style={{ width: `${(survivor.life / 100) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat-bar">
        <div className="stat-label">
          <span>Hope:</span>
          <span>{survivor.hope}%</span>
        </div>
        <div className="stat-fill">
          <div 
            className="stat-fill-value hope" 
            style={{ width: `${survivor.hope}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat-bar">
        <div className="stat-label">
          <span>Trust:</span>
          <span>{survivor.trust}%</span>
        </div>
        <div className="stat-fill">
          <div 
            className="stat-fill-value trust" 
            style={{ width: `${survivor.trust}%` }}
          ></div>
        </div>
      </div>
      
      <p className="mt-2 text-sm italic text-gray-300">"{survivor.dream}"</p>
      <p className="text-xs text-gray-400 mt-1">Destination: {survivor.destination}</p>
    </div>
  );
}

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
      className={`bg-gray-700 rounded-lg p-4 border transition-colors cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-lg font-bold">{survivor.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{survivor.name}</h3>
          <p className="text-gray-300 text-sm">{survivor.profession} • {survivor.personality}</p>
          
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Life:</span>
              <span>{survivor.life} days</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(survivor.life / 100) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Hope:</span>
              <span>{survivor.hope}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${survivor.hope}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Trust:</span>
              <span>{survivor.trust}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${survivor.trust}%` }}
              ></div>
            </div>
          </div>
          
          <p className="mt-2 text-sm italic text-gray-300">"{survivor.dream}"</p>
        </div>
      </div>
    </div>
  );
}

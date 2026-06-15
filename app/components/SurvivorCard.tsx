'use client';

import { useState } from 'react';
import type { Survivor } from '../page';

export default function SurvivorCard({ survivor }: { survivor: Survivor }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{survivor.name}</h3>
        {survivor.infectionTime !== null && (
          <span className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs">
            {survivor.infectionTime}h
          </span>
        )}
      </div>
      
      <div className="mt-2 flex items-center space-x-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${survivor.health}%` }}
          ></div>
        </div>
        <span className="text-sm">{survivor.health}%</span>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-sm text-gray-300">Age: {survivor.age}</p>
          <p className="text-sm text-gray-300">Relationship: {survivor.relationship}/100</p>
          
          <div className="mt-2">
            <p className="text-xs text-gray-400">Skills:</p>
            <div className="flex space-x-2 mt-1">
              <span className="text-xs bg-blue-900 px-2 py-1 rounded">Scavenging: {survivor.skills.scavenging}</span>
              <span className="text-xs bg-green-900 px-2 py-1 rounded">Healing: {survivor.skills.healing}</span>
              <span className="text-xs bg-purple-900 px-2 py-1 rounded">Crafting: {survivor.skills.crafting}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-400">Traits:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {survivor.traits.map((trait, index) => (
                <span key={index} className="text-xs bg-yellow-900 px-2 py-1 rounded">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

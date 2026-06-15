'use client';

import { useState } from 'react';
import type { Survivor } from '../page';

export default function SurvivorCard({ survivor }: { survivor: Survivor }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer shadow-lg"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-xl">{survivor.name}</h3>
        {survivor.infectionTime !== null && (
          <span className="bg-red-900 text-red-200 px-3 py-1 rounded-full text-sm font-bold">
            {survivor.infectionTime}h
          </span>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Health</span>
          <span>{survivor.health}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full" 
            style={{ width: `${survivor.health}%` }}
          ></div>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-300 mb-2">Age: {survivor.age}</p>
          <p className="text-gray-300 mb-2">Relationship: {survivor.relationship}/100</p>
          
          <div className="mb-3">
            <p className="text-gray-400 text-sm mb-1">Skills:</p>
            <div className="flex space-x-2 mb-2">
              <span className="bg-blue-900 px-2 py-1 rounded text-xs">Scavenging: {survivor.skills.scavenging}</span>
              <span className="bg-green-900 px-2 py-1 rounded text-xs">Healing: {survivor.skills.healing}</span>
              <span className="bg-purple-900 px-2 py-1 rounded text-xs">Crafting: {survivor.skills.crafting}</span>
            </div>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm mb-1">Traits:</p>
            <div className="flex flex-wrap gap-1">
              {survivor.traits.map((trait, index) => (
                <span key={index} className="bg-yellow-900 px-2 py-1 rounded text-xs">
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

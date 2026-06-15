'use client';

import type { GameLogEntry } from '../page';

export default function StoryFeed({ logEntries }: { logEntries: GameLogEntry[] }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h2 className="text-xl font-semibold mb-3">Story Feed</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {logEntries.map(entry => (
          <div 
            key={entry.id} 
            className="bg-gray-700 rounded-lg p-3 border border-gray-600 text-sm"
          >
            <p>{entry.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import type { Event } from '../page';

export default function EventModal({ 
  event, 
  onClose, 
  onChoice 
}: { 
  event: Event; 
  onClose: () => void; 
  onChoice: (choice: any) => void; 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-3">{event.title}</h2>
        <p className="text-gray-300 mb-6">{event.description}</p>
        
        <div className="space-y-3">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              {choice.text}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors border border-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

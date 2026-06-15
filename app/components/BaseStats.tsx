'use client';

import type { Resource } from '../page';

export default function BaseStats({ resources }: { resources: Resource[] }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">Base Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{resource.name}</span>
              <span className="text-sm">{resource.amount}/{resource.max}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  resource.name === 'Food' ? 'bg-orange-500' : 
                  resource.name === 'Medicine' ? 'bg-blue-500' : 
                  'bg-green-500'
                }`} 
                style={{ width: `${(resource.amount / resource.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

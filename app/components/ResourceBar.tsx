'use client';

import type { Resource } from '../page';

export default function ResourceBar({ resources }: { resources: Resource[] }) {
  return (
    <div className="mt-4 flex space-x-2">
      {resources.map((resource, index) => (
        <div key={index} className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span>{resource.name}</span>
            <span>{resource.amount}/{resource.max}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
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
  );
}

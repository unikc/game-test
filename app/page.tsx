'use client';

import { useState, useEffect } from 'react';
import SurvivorCard from './components/SurvivorCard';
import BaseStats from './components/BaseStats';
import EventModal from './components/EventModal';
import ResourceBar from './components/ResourceBar';

// Types
type Survivor = {
  id: string;
  name: string;
  age: number;
  health: number;
  infectionTime: number | null; // null means not infected
  relationship: number; // 0-100
  skills: {
    scavenging: number;
    healing: number;
    crafting: number;
  };
  traits: string[];
};

type Resource = {
  name: string;
  amount: number;
  max: number;
};

type Event = {
  id: string;
  title: string;
  description: string;
  choices: {
    text: string;
    effect: (survivors: Survivor[], resources: Resource[]) => { survivors: Survivor[]; resources: Resource[] };
  }[];
};

type GameLogEntry = {
  id: string;
  message: string;
  timestamp: number;
};

// Initial data
const initialSurvivors: Survivor[] = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    health: 100,
    infectionTime: null,
    relationship: 50,
    skills: { scavenging: 5, healing: 3, crafting: 4 },
    traits: ['Optimistic', 'Resourceful'],
  },
  {
    id: '2',
    name: 'Maya',
    age: 32,
    health: 100,
    infectionTime: null,
    relationship: 60,
    skills: { scavenging: 4, healing: 6, crafting: 3 },
    traits: ['Caring', 'Strong'],
  },
  {
    id: '3',
    name: 'Jordan',
    age: 25,
    health: 100,
    infectionTime: null,
    relationship: 40,
    skills: { scavenging: 7, healing: 2, crafting: 5 },
    traits: ['Adventurous', 'Brave'],
  },
];

const initialResources: Resource[] = [
  { name: 'Food', amount: 50, max: 100 },
  { name: 'Medicine', amount: 10, max: 20 },
  { name: 'Materials', amount: 30, max: 100 },
];

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Strange Signal',
    description: 'You hear a radio signal in the distance. It might be survivors or something else entirely.',
    choices: [
      {
        text: 'Investigate the signal',
        effect: (survivors, resources) => {
          // Random chance of finding supplies or encountering danger
          const foundSupplies = Math.random() > 0.5;
          if (foundSupplies) {
            resources[0].amount += 10; // Food
            resources[2].amount += 5;  // Materials
          }
          return { survivors, resources };
        },
      },
      {
        text: 'Ignore it and continue',
        effect: (survivors, resources) => {
          // No immediate effect
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '2',
    title: 'Infection Outbreak',
    description: 'A group member has been exposed to the infection. You have limited medicine to treat them.',
    choices: [
      {
        text: 'Use medicine on them',
        effect: (survivors, resources) => {
          // Find the infected survivor and reduce their infection time
          const updatedSurvivors = survivors.map(s => 
            s.id === '2' ? { ...s, infectionTime: 30 } : s
          );
          resources[1].amount -= 1; // Use one medicine
          return { survivors: updatedSurvivors, resources };
        },
      },
      {
        text: 'Wait and see',
        effect: (survivors, resources) => {
          // Infection progresses faster
          const updatedSurvivors = survivors.map(s => 
            s.id === '2' ? { ...s, infectionTime: 15 } : s
          );
          return { survivors: updatedSurvivors, resources };
        },
      },
    ],
  },
];

export default function Home() {
  const [survivors, setSurvivors] = useState<Survivor[]>(initialSurvivors);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [showEventModal, setShowEventModal] = useState(false);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([
    { id: '1', message: 'Welcome to the Cozy Apocalypse', timestamp: Date.now() }
  ]);

  // Add log entry
  const addLogEntry = (message: string) => {
    setGameLog(prev => [
      { id: Date.now().toString(), message, timestamp: Date.now() },
      ...prev.slice(0, 9) // Keep only last 10 entries
    ]);
  };

  // Simulate time passing
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Randomly trigger events
      if (Math.random() > 0.95 && !currentEvent) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setCurrentEvent(randomEvent);
        setShowEventModal(true);
        addLogEntry(`New event: ${randomEvent.title}`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [events, currentEvent]);

  // Handle event choice
  const handleEventChoice = (choice: { text: string; effect: (survivors: Survivor[], resources: Resource[]) => { survivors: Survivor[]; resources: Resource[] } }) => {
    if (!currentEvent) return;
    
    const result = choice.effect(survivors, resources);
    setSurvivors(result.survivors);
    setResources(result.resources);
    
    setCurrentEvent(null);
    setShowEventModal(false);
  };

  // Update infection timers
  useEffect(() => {
    const interval = setInterval(() => {
      setSurvivors(prevSurvivors => 
        prevSurvivors.map(survivor => {
          if (survivor.infectionTime !== null) {
            return { ...survivor, infectionTime: survivor.infectionTime - 1 };
          }
          return survivor;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Action functions
  const handleAdvanceTime = () => {
    setGameTime(prev => prev + 1);
    addLogEntry('Time advanced');
  };

  const handleScavenge = () => {
    const foodGain = Math.floor(Math.random() * 10) + 5;
    const materialsGain = Math.floor(Math.random() * 5) + 2;
    
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.min(res.amount + foodGain, res.max) } : 
        res.name === 'Materials' ? { ...res, amount: Math.min(res.amount + materialsGain, res.max) } : 
        res
      )
    );
    
    addLogEntry(`Scavenged ${foodGain} food and ${materialsGain} materials`);
  };

  const handleRest = () => {
    setSurvivors(prev => 
      prev.map(survivor => ({
        ...survivor,
        health: Math.min(100, survivor.health + 5)
      }))
    );
    
    addLogEntry('Group rested and recovered some health');
  };

  const handleUseMedicine = () => {
    if (resources.find(r => r.name === 'Medicine')?.amount! > 0) {
      setResources(prev => 
        prev.map(res => 
          res.name === 'Medicine' ? { ...res, amount: Math.max(0, res.amount - 1) } : res
        )
      );
      
      // Find the first infected survivor and reduce their infection time
      const infectedSurvivor = survivors.find(s => s.infectionTime !== null);
      if (infectedSurvivor) {
        setSurvivors(prev => 
          prev.map(s => 
            s.id === infectedSurvivor.id ? { ...s, infectionTime: Math.max(0, s.infectionTime! - 20) } : s
          )
        );
        addLogEntry(`Used medicine on ${infectedSurvivor.name}`);
      } else {
        addLogEntry('No one is infected to treat');
      }
    } else {
      addLogEntry('Not enough medicine!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      {/* Top Status Bar */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4 flex justify-between items-center border border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Cozy Apocalypse</h1>
          <p className="text-gray-300">Day {Math.floor(gameTime / 12)} - Time: {gameTime % 12} hours</p>
        </div>
        <div className="text-right">
          <p className="text-sm">
            {survivors.filter(s => s.infectionTime !== null).length} infected
          </p>
          <p className="text-sm text-gray-300">
            {survivors.length} survivors
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Resources and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resources Cards */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-semibold mb-3">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((resource, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">{resource.name}</span>
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

          {/* Action Buttons */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-semibold mb-3">Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={handleAdvanceTime}
                className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Advance Time
              </button>
              <button 
                onClick={handleScavenge}
                className="bg-green-900 hover:bg-green-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Scavenge
              </button>
              <button 
                onClick={handleRest}
                className="bg-purple-900 hover:bg-purple-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Rest
              </button>
              <button 
                onClick={handleUseMedicine}
                className="bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Use Medicine
              </button>
            </div>
          </div>

          {/* Survivors */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Survivors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {survivors.map(survivor => (
                <SurvivorCard 
                  key={survivor.id} 
                  survivor={survivor} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Event Log */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
            <h2 className="text-xl font-semibold mb-3">Event Log</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {gameLog.map(entry => (
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
        </div>
      </main>

      {/* Event Modal */}
      {showEventModal && currentEvent && (
        <EventModal 
          event={currentEvent} 
          onClose={() => setShowEventModal(false)}
          onChoice={handleEventChoice}
        />
      )}
    </div>
  );
}

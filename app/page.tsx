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

  // Simulate time passing
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Randomly trigger events
      if (Math.random() > 0.95 && !currentEvent) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setCurrentEvent(randomEvent);
        setShowEventModal(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">Cozy Apocalypse</h1>
        <p className="text-gray-300">Survive, build relationships, make choices</p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Base Stats */}
        <BaseStats resources={resources} />

        {/* Resource Bar */}
        <ResourceBar resources={resources} />

        {/* Survivors */}
        <div className="mt-8">
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

        {/* Game Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-300">Day {Math.floor(gameTime / 12)} - Time: {gameTime % 12} hours</p>
          <p className="text-gray-400 mt-2">
            {survivors.filter(s => s.infectionTime !== null).length} survivors infected
          </p>
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

'use client';

import { useState, useEffect } from 'react';
import SurvivorCard from './components/SurvivorCard';
import CampStatus from './components/CampStatus';
import StoryFeed from './components/StoryFeed';

// Types
type Survivor = {
  id: string;
  name: string;
  profession: string;
  personality: string;
  life: number; // days remaining
  hope: number; // 0-100
  trust: number; // 0-100
  dream: string;
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
  category: 'resource' | 'conflict' | 'personal' | 'moral' | 'illness' | 'betrayal' | 'hopeful';
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
    name: 'Elena',
    profession: 'Teacher',
    personality: 'Compassionate',
    life: 45,
    hope: 70,
    trust: 65,
    dream: 'I want to see my old school one last time.'
  },
  {
    id: '2',
    name: 'Marcus',
    profession: 'Nurse',
    personality: 'Determined',
    life: 32,
    hope: 40,
    trust: 80,
    dream: 'I want to see the ocean.'
  },
  {
    id: '3',
    name: 'Sophie',
    profession: 'Engineer',
    personality: 'Practical',
    life: 28,
    hope: 55,
    trust: 75,
    dream: 'I want to finish the bridge I started.'
  },
  {
    id: '4',
    name: 'David',
    profession: 'Mother',
    personality: 'Protective',
    life: 38,
    hope: 60,
    trust: 90,
    dream: 'I want to find my daughter.'
  },
  {
    id: '5',
    name: 'James',
    profession: 'Artist',
    personality: 'Creative',
    life: 25,
    hope: 30,
    trust: 50,
    dream: 'I want to paint one more sunset.'
  }
];

const initialResources: Resource[] = [
  { name: 'Food', amount: 50, max: 100 },
  { name: 'Medicine', amount: 20, max: 50 },
  { name: 'Morale', amount: 60, max: 100 }
];

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Strange Signal',
    description: 'You hear a radio signal in the distance. It might be survivors or something else entirely.',
    category: 'resource',
    choices: [
      {
        text: 'Investigate the signal',
        effect: (survivors, resources) => {
          const foundSupplies = Math.random() > 0.5;
          if (foundSupplies) {
            resources[0].amount += 10; // Food
            resources[2].amount += 5;  // Morale
          }
          return { survivors, resources };
        },
      },
      {
        text: 'Ignore it and continue',
        effect: (survivors, resources) => {
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '2',
    title: 'Child in Need',
    description: 'A child asks to join your camp. They seem lost and scared.',
    category: 'conflict',
    choices: [
      {
        text: 'Take them in',
        effect: (survivors, resources) => {
          resources[0].amount -= 5; // Food
          resources[2].amount += 10; // Morale
          return { survivors, resources };
        },
      },
      {
        text: 'Send them away',
        effect: (survivors, resources) => {
          resources[2].amount -= 5; // Morale
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '3',
    title: 'Memory of Home',
    description: 'Sarah found a photograph of her old home.',
    category: 'personal',
    choices: [
      {
        text: 'Share the photo with everyone',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.hope = Math.min(100, s.hope + 5));
          resources[2].amount += 5; // Morale
          return { survivors, resources };
        },
      },
      {
        text: 'Keep it private',
        effect: (survivors, resources) => {
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '4',
    title: 'Medical Dilemma',
    description: 'You have limited medicine. Who should receive treatment?',
    category: 'moral',
    choices: [
      {
        text: 'Treat the one with most hope',
        effect: (survivors, resources) => {
          resources[1].amount -= 1; // Medicine
          survivors.forEach(s => s.hope = Math.min(100, s.hope + 3));
          return { survivors, resources };
        },
      },
      {
        text: 'Treat the one with most trust',
        effect: (survivors, resources) => {
          resources[1].amount -= 1; // Medicine
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '5',
    title: 'Illness Strikes',
    description: 'A survivor has fallen ill. The infection is spreading.',
    category: 'illness',
    choices: [
      {
        text: 'Use medicine to treat them',
        effect: (survivors, resources) => {
          resources[1].amount -= 1; // Medicine
          return { survivors, resources };
        },
      },
      {
        text: 'Let nature take its course',
        effect: (survivors, resources) => {
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '6',
    title: 'Betrayal',
    description: 'Mike secretly stole medicine.',
    category: 'betrayal',
    choices: [
      {
        text: 'Confront Mike publicly',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.trust = Math.max(0, s.trust - 10));
          resources[2].amount -= 5; // Morale
          return { survivors, resources };
        },
      },
      {
        text: 'Deal with it privately',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.trust = Math.max(0, s.trust - 5));
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '7',
    title: 'Hopeful Discovery',
    description: 'You found a beautiful garden. The sight brings joy to everyone.',
    category: 'hopeful',
    choices: [
      {
        text: 'Rest here for the day',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.hope = Math.min(100, s.hope + 10));
          resources[2].amount += 15; // Morale
          return { survivors, resources };
        },
      },
      {
        text: 'Continue the journey',
        effect: (survivors, resources) => {
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '8',
    title: 'Lost Connection',
    description: 'You lost contact with a survivor during travel.',
    category: 'conflict',
    choices: [
      {
        text: 'Search for them',
        effect: (survivors, resources) => {
          resources[0].amount -= 5; // Food
          resources[2].amount += 10; // Morale
          return { survivors, resources };
        },
      },
      {
        text: 'Continue without them',
        effect: (survivors, resources) => {
          resources[2].amount -= 5; // Morale
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '9',
    title: 'Memory of a Friend',
    description: 'A survivor shares memories of their late friend.',
    category: 'personal',
    choices: [
      {
        text: 'Listen and offer comfort',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.hope = Math.min(100, s.hope + 5));
          return { survivors, resources };
        },
      },
      {
        text: 'Move on quickly',
        effect: (survivors, resources) => {
          return { survivors, resources };
        },
      },
    ],
  },
  {
    id: '10',
    title: 'Moral Choice',
    description: 'You find a cache of medicine. Should you share it?',
    category: 'moral',
    choices: [
      {
        text: 'Share with everyone',
        effect: (survivors, resources) => {
          survivors.forEach(s => s.hope = Math.min(100, s.hope + 15));
          return { survivors, resources };
        },
      },
      {
        text: 'Keep it for your group',
        effect: (survivors, resources) => {
          resources[1].amount += 5; // Medicine
          return { survivors, resources };
        },
      },
    ],
  }
];

export default function Home() {
  const [survivors, setSurvivors] = useState<Survivor[]>(initialSurvivors);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [showEventModal, setShowEventModal] = useState(false);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([
    { id: '1', message: 'Welcome to Road to Ithaca', timestamp: Date.now() }
  ]);
  const [selectedSurvivor, setSelectedSurvivor] = useState<string | null>(null);

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

  // Action functions
  const handleExplore = () => {
    const foodGain = Math.floor(Math.random() * 10) + 5;
    const moraleGain = Math.floor(Math.random() * 5) + 2;
    
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.min(res.amount + foodGain, res.max) } : 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + moraleGain, res.max) } : 
        res
      )
    );
    
    addLogEntry(`Exploration yielded ${foodGain} food and ${moraleGain} morale`);
  };

  const handleTravel = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - 5) } : 
        res
      )
    );
    
    addLogEntry('Traveled to a new location');
  };

  const handleTalk = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 10, res.max) } : 
        res
      )
    );
    
    addLogEntry('Group had meaningful conversations');
  };

  const handleRest = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 15, res.max) } : 
        res
      )
    );
    
    addLogEntry('Group rested and recovered');
  };

  // Update life each day
  useEffect(() => {
    const interval = setInterval(() => {
      setSurvivors(prevSurvivors => 
        prevSurvivors.map(survivor => ({
          ...survivor,
          life: Math.max(0, survivor.life - 1)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check for game over conditions
  useEffect(() => {
    const allDead = survivors.every(s => s.life <= 0);
    if (allDead) {
      addLogEntry('All survivors have passed away. Game Over.');
    }
  }, [survivors]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Top Status Bar */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4 flex justify-between items-center border border-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Road to Ithaca</h1>
          <p className="text-gray-300">Day {gameTime}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">
            {survivors.filter(s => s.life > 0).length} survivors
          </p>
          <p className="text-sm text-gray-300">
            {survivors.filter(s => s.life <= 0).length} deceased
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Survivors */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
            <h2 className="text-xl font-semibold mb-3">Survivors</h2>
            <div className="space-y-3">
              {survivors.map(survivor => (
                <SurvivorCard 
                  key={survivor.id} 
                  survivor={survivor}
                  isSelected={selectedSurvivor === survivor.id}
                  onClick={() => setSelectedSurvivor(selectedSurvivor === survivor.id ? null : survivor.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Column - Camp Status */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
            <CampStatus resources={resources} />
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleExplore}
                  className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
                >
                  Explore
                </button>
                <button 
                  onClick={handleTravel}
                  className="bg-green-900 hover:bg-green-800 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
                >
                  Travel
                </button>
                <button 
                  onClick={handleTalk}
                  className="bg-purple-900 hover:bg-purple-800 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
                >
                  Talk
                </button>
                <button 
                  onClick={handleRest}
                  className="bg-yellow-900 hover:bg-yellow-800 text-white py-3 px-4 rounded-lg transition-colors border border-gray-700"
                >
                  Rest
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Story Feed */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 h-full">
            <h2 className="text-xl font-semibold mb-3">Story Feed</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-3">{currentEvent.title}</h2>
            <p className="text-gray-300 mb-4">{currentEvent.description}</p>
            
            <div className="space-y-3">
              {currentEvent.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleEventChoice(choice)}
                  className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                >
                  {choice.text}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowEventModal(false)}
              className="mt-6 w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors border border-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

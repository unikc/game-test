'use client';

import { useState, useEffect } from 'react';
import SurvivorCard from './components/SurvivorCard';

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
  destination: string;
  distanceToDestination: number; // days away
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

type Memory = {
  id: string;
  survivorId: string;
  description: string;
  timestamp: number;
};

type MapNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  discovered: boolean;
  visited: boolean;
  connectedNodes: string[];
  storyEvents: string[];
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
    dream: 'I want to see my old school one last time.',
    destination: 'Old School',
    distanceToDestination: 12
  },
  {
    id: '2',
    name: 'Marcus',
    profession: 'Nurse',
    personality: 'Determined',
    life: 32,
    hope: 40,
    trust: 80,
    dream: 'I want to see the ocean.',
    destination: 'Harbor',
    distanceToDestination: 15
  },
  {
    id: '3',
    name: 'Sophie',
    profession: 'Engineer',
    personality: 'Practical',
    life: 28,
    hope: 55,
    trust: 75,
    dream: 'I want to finish the bridge I started.',
    destination: 'Bridge Site',
    distanceToDestination: 10
  },
  {
    id: '4',
    name: 'David',
    profession: 'Mother',
    personality: 'Protective',
    life: 38,
    hope: 60,
    trust: 90,
    dream: 'I want to find my daughter.',
    destination: 'Riverside Settlement',
    distanceToDestination: 20
  },
  {
    id: '5',
    name: 'James',
    profession: 'Artist',
    personality: 'Creative',
    life: 25,
    hope: 30,
    trust: 50,
    dream: 'I want to paint one more sunset.',
    destination: 'Sunset Viewpoint',
    distanceToDestination: 8
  }
];

const initialResources: Resource[] = [
  { name: 'Food', amount: 50, max: 100 },
  { name: 'Medicine', amount: 20, max: 50 },
  { name: 'Morale', amount: 60, max: 100 }
];

const initialMapNodes: MapNode[] = [
  {
    id: 'camp',
    name: 'Camp',
    x: 50,
    y: 50,
    description: 'Your base of operations. A small shelter built from scavenged materials.',
    discovered: true,
    visited: true,
    connectedNodes: ['forest', 'town'],
    storyEvents: [
      "You set up camp in the clearing. The smell of smoke lingers in the air.",
      "The group gathers around the fire, sharing stories of better times."
    ]
  },
  {
    id: 'forest',
    name: 'North Forest',
    x: 20,
    y: 30,
    description: 'A dense forest with tall trees and thick undergrowth. The air is thick with mystery.',
    discovered: false,
    visited: false,
    connectedNodes: ['camp', 'hospital'],
    storyEvents: [
      "The forest is eerily quiet. You hear something rustling in the bushes.",
      "You find a small stream running through the trees. It's clear and fresh."
    ]
  },
  {
    id: 'town',
    name: 'Abandoned Town',
    x: 80,
    y: 30,
    description: 'A once-bustling town now silent and empty. Buildings stand in ruins.',
    discovered: false,
    visited: false,
    connectedNodes: ['camp', 'school'],
    storyEvents: [
      "The streets are littered with debris. You find a child's toy in the rubble.",
      "You hear voices from an abandoned building. They fade quickly."
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital',
    x: 20,
    y: 70,
    description: 'A crumbling hospital building with broken windows and a faded sign.',
    discovered: false,
    visited: false,
    connectedNodes: ['forest', 'school'],
    storyEvents: [
      "You found a locked medicine cabinet.",
      "Maya recognizes the smell of disinfectant and goes quiet.",
      "The hospital is filled with echoes of past suffering."
    ]
  },
  {
    id: 'school',
    name: 'Old School',
    x: 80,
    y: 70,
    description: 'An old school building with broken windows and a faded sign.',
    discovered: false,
    visited: false,
    connectedNodes: ['town', 'hospital', 'farm'],
    storyEvents: [
      "Michael finds his old classroom. The blackboard still has his handwriting.",
      "You find a collection of student drawings on the wall.",
      "The school bell still rings in your memory."
    ]
  },
  {
    id: 'farm',
    name: 'Farm',
    x: 50,
    y: 90,
    description: 'An abandoned farm with overgrown fields and broken fences.',
    discovered: false,
    visited: false,
    connectedNodes: ['school', 'riverside'],
    storyEvents: [
      "The soil is dry, but something still grows here.",
      "You find a small garden that someone tended to before the pandemic.",
      "A barn creaks in the wind. You hear something moving inside."
    ]
  },
  {
    id: 'riverside',
    name: 'Riverside',
    x: 20,
    y: 90,
    description: 'A quiet riverside with a small bridge and clear water.',
    discovered: false,
    visited: false,
    connectedNodes: ['farm', 'harbor'],
    storyEvents: [
      "A message is carved into the bridge: THEY WENT EAST.",
      "The river flows calmly. You feel a sense of peace here.",
      "You find an old fishing net tangled in the reeds."
    ]
  },
  {
    id: 'harbor',
    name: 'Harbor',
    x: 20,
    y: 10,
    description: 'A quiet harbor with boats and a lighthouse.',
    discovered: false,
    visited: false,
    connectedNodes: ['riverside'],
    storyEvents: [
      "Sarah sees the ocean for the first time in years.",
      "The waves crash against the rocks. You feel the vastness of the world.",
      "You find a small boat that might still be seaworthy."
    ]
  }
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
    { id: '1', message: 'Welcome to Cozy Apocalypse', timestamp: Date.now() }
  ]);
  const [selectedSurvivor, setSelectedSurvivor] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentLocation, setCurrentLocation] = useState('Camp');
  const [mapNodes, setMapNodes] = useState<MapNode[]>(initialMapNodes);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [currentStoryEvent, setCurrentStoryEvent] = useState<string | null>(null);

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
    // Find current location node
    const currentNode = mapNodes.find(node => node.name === currentLocation);
    
    if (currentNode) {
      // Randomly select a story event from this location
      const randomEvent = currentNode.storyEvents[Math.floor(Math.random() * currentNode.storyEvents.length)];
      setCurrentStoryEvent(randomEvent);
      
      // Add some resources randomly
      const foodGain = Math.floor(Math.random() * 5) + 1;
      const medicineGain = Math.floor(Math.random() * 3);
      
      setResources(prev => 
        prev.map(res => 
          res.name === 'Food' ? { ...res, amount: Math.min(res.amount + foodGain, res.max) } : 
          res.name === 'Medicine' ? { ...res, amount: Math.min(res.amount + medicineGain, res.max) } : 
          res
        )
      );
      
      addLogEntry(`Explored ${currentLocation} and found ${foodGain} food and ${medicineGain} medicine`);
    }
  };

  const handleTravel = () => {
    if (!selectedDestination) {
      addLogEntry('Select a connected location on the map first.');
      return;
    }

    // Find current location node
    const currentNode = mapNodes.find(node => node.name === currentLocation);
    
    if (currentNode && currentNode.connectedNodes.includes(selectedDestination)) {
      // Check if destination is discovered
      const destinationNode = mapNodes.find(node => node.name === selectedDestination);
      
      if (!destinationNode || !destinationNode.discovered) {
        addLogEntry('You cannot travel to an undiscovered location.');
        return;
      }
      
      // Consume resources
      setResources(prev => 
        prev.map(res => 
          res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - 1) } : 
          res
        )
      );
      
      // Update current location
      setCurrentLocation(selectedDestination);
      
      // Mark destination as visited
      setMapNodes(prev => 
        prev.map(node => 
          node.name === selectedDestination ? { ...node, visited: true } : node
        )
      );
      
      // Reveal connected undiscovered nodes
      if (destinationNode) {
        const updatedNodes = mapNodes.map(node => {
          if (destinationNode.connectedNodes.includes(node.id) && !node.discovered) {
            return { ...node, discovered: true };
          }
          return node;
        });
        setMapNodes(updatedNodes);
      }
      
      // Add story event
      const randomEvent = destinationNode.storyEvents[Math.floor(Math.random() * destinationNode.storyEvents.length)];
      setCurrentStoryEvent(randomEvent);
      
      addLogEntry(`Traveled to ${selectedDestination}`);
      setSelectedDestination(null);
    } else {
      addLogEntry('You cannot travel there from your current location.');
    }
  };

  const handleTalk = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 5, res.max) } : 
        res
      )
    );
    
    // Randomly increase hope or trust for a survivor
    const randomSurvivor = survivors[Math.floor(Math.random() * survivors.length)];
    const statIncrease = Math.floor(Math.random() * 10) + 1;
    
    setSurvivors(prev => 
      prev.map(s => 
        s.id === randomSurvivor.id 
          ? { ...s, hope: Math.min(100, s.hope + statIncrease), trust: Math.min(100, s.trust + statIncrease) } 
          : s
      )
    );
    
    addLogEntry('Group had meaningful conversations');
  };

  const handleRest = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 5, res.max) } : 
        res
      )
    );
    
    addLogEntry('Group rested and recovered');
  };

  const handleEndTime = () => {
    // Advance to next day
    setGameTime(prev => prev + 24);
    
    // Every survivor loses 1 life day
    setSurvivors(prev => 
      prev.map(survivor => ({
        ...survivor,
        life: Math.max(0, survivor.life - 1)
      }))
    );
    
    // Add one random overnight event
    const overnightEvents = [
      "The night was restless. You heard strange sounds outside.",
      "You woke up to find a note on your pillow.",
      "A survivor had a dream about their family.",
      "The group huddled together for warmth."
    ];
    
    const randomEvent = overnightEvents[Math.floor(Math.random() * overnightEvents.length)];
    addLogEntry(randomEvent);
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

  // Check for destination reached
  useEffect(() => {
    survivors.forEach(survivor => {
      if (survivor.distanceToDestination === 0 && survivor.life > 0) {
        // Survivor has reached their destination
        const memory: Memory = {
          id: Date.now().toString(),
          survivorId: survivor.id,
          description: `${survivor.name} reached ${survivor.destination}`,
          timestamp: Date.now()
        };
        
        setMemories(prev => [...prev, memory]);
        
        // Update survivor stats
        setSurvivors(prev => 
          prev.map(s => 
            s.id === survivor.id 
              ? { ...s, hope: Math.min(100, s.hope + 50), trust: Math.min(100, s.trust + 30) } 
              : s
          )
        );
        
        addLogEntry(`${survivor.name} reached their destination! Hope and trust increased.`);
      }
    });
  }, [survivors]);

  // Calculate journey progress for the current survivor
  const calculateJourneyProgress = (survivor: Survivor) => {
    if (survivor.distanceToDestination === 0) return 100;
    
    // Find the total distance to destination from camp
    const totalDistance = 25; // Approximate total distance for calculation
    return Math.max(0, Math.min(100, ((totalDistance - survivor.distanceToDestination) / totalDistance) * 100));
  };

  // Get current location node
  const currentNode = mapNodes.find(node => node.name === currentLocation);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Top Status Bar */}
      <div className="top-bar">
        <div>
          <h1 className="text-2xl font-bold">Cozy Apocalypse</h1>
          <p className="text-gray-300">Day {Math.floor(gameTime / 24)} - Time: {gameTime % 24} hours</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-right">
            <p className="text-sm">Food: {resources[0].amount}</p>
            <p className="text-sm">Medicine: {resources[1].amount}</p>
            <p className="text-sm">Morale: {resources[2].amount}</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Left Column - Survivors */}
        <div className="left-panel">
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

        {/* Center Column - Map */}
        <div className="center-panel">
          <h2 className="text-xl font-semibold mb-3">Map</h2>
          
          <div className="map-container">
            {/* Roads - rendered first to be behind nodes */}
            {mapNodes.map(node => (
              node.connectedNodes.map(connectedId => {
                const connectedNode = mapNodes.find(n => n.id === connectedId);
                if (!connectedNode) return null;
                
                return (
                  <svg 
                    key={`${node.id}-${connectedId}`} 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                  >
                    <line 
                      x1={`${node.x}%`} 
                      y1={`${node.y}%`} 
                      x2={`${connectedNode.x}%`} 
                      y2={`${connectedNode.y}%`} 
                      stroke="#6b7280" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                  </svg>
                );
              })
            ))}
            
            {/* Nodes */}
            {mapNodes.map(node => (
              <button
                key={node.id}
                className={`node ${
                  node.name === currentLocation ? 'current' : 
                  node.discovered ? (node.visited ? 'visited' : 'discovered') : 'undiscovered'
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => {
                  if (node.discovered && node.name !== currentLocation) {
                    setSelectedDestination(node.name);
                  }
                }}
                disabled={!node.discovered}
              >
                {node.discovered ? (
                  <span className="text-xs font-bold">{node.name.charAt(0)}</span>
                ) : (
                  <span className="text-xs">???</span>
                )}
              </button>
            ))}
            
            {/* Current location indicator */}
            {currentNode && (
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${currentNode.x}%`, top: `${currentNode.y - 5}%` }}
              >
                <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
                  <p className="text-sm font-bold">{currentLocation}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Selected destination indicator */}
          {selectedDestination && (
            <div className="mt-3 bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm">Selected: {selectedDestination}</p>
              <p className="text-xs text-gray-300 mt-1">Click Travel to move here</p>
            </div>
          )}
        </div>

        {/* Right Column - Location Details */}
        <div className="right-panel">
          <h2 className="text-xl font-semibold mb-3">Location</h2>
          
          {currentNode ? (
            <>
              <h3 className="text-lg font-bold mb-2">{currentNode.name}</h3>
              <p className="text-gray-300 mb-4">{currentNode.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Story Events</h4>
                {currentStoryEvent ? (
                  <div className="bg-gray-700 rounded-lg p-3 border border-gray-600 text-sm">
                    <p>{currentStoryEvent}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No events yet</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Destination</h4>
                <p className="text-gray-300">{survivors.find(s => s.name === currentLocation)?.destination || 'No destination'}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Select a location on the map</p>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="action-bar">
        <button 
          onClick={handleExplore}
          className="action-button"
        >
          Explore
        </button>
        <button 
          onClick={handleTravel}
          className="action-button"
        >
          Travel
        </button>
        <button 
          onClick={handleTalk}
          className="action-button"
        >
          Talk
        </button>
        <button 
          onClick={handleRest}
          className="action-button"
        >
          Rest
        </button>
        <button 
          onClick={handleEndTime}
          className="action-button"
        >
          End Time
        </button>
      </div>

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

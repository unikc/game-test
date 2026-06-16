'use client';

import { useState } from 'react';

export default function Home() {
  const [gameTime, setGameTime] = useState(0);
  const [resources, setResources] = useState([
    { name: 'Food', amount: 50, max: 100 },
    { name: 'Medicine', amount: 20, max: 50 },
    { name: 'Morale', amount: 60, max: 100 }
  ]);
  
  const [survivors, setSurvivors] = useState([
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
      distanceToDestination: 12,
      dead: false
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
      distanceToDestination: 15,
      dead: false
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
      distanceToDestination: 10,
      dead: false
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
      distanceToDestination: 20,
      dead: false
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
      distanceToDestination: 8,
      dead: false
    }
  ]);
  
  const [mapNodes, setMapNodes] = useState([
    { id: 'camp', name: 'Camp', discovered: true, visited: true, emoji: '🏕️', connectedNodes: ['forest', 'hospital'], x: 50, y: 30 },
    { id: 'forest', name: 'Forest', discovered: false, visited: false, emoji: '🌲', connectedNodes: ['camp', 'hospital'], x: 20, y: 30 },
    { id: 'hospital', name: 'Hospital', discovered: false, visited: false, emoji: '✚', connectedNodes: ['forest', 'school'], x: 80, y: 30 },
    { id: 'school', name: 'Old School', discovered: false, visited: false, emoji: '🏫', connectedNodes: ['town', 'hospital', 'farm'], x: 50, y: 10 },
    { id: 'farm', name: 'Farm', discovered: false, visited: false, emoji: '🌾', connectedNodes: ['school', 'riverside'], x: 40, y: 55 },
    { id: 'riverside', name: 'Riverside', discovered: false, visited: false, emoji: '🌊', connectedNodes: ['farm', 'harbor'], x: 25, y: 80 },
    { id: 'bridge', name: 'Bridge Site', discovered: false, visited: false, emoji: '🌉', connectedNodes: ['riverside'], x: 60, y: 55 },
    { id: 'harbor', name: 'Harbor', discovered: false, visited: false, emoji: '⚓', connectedNodes: ['riverside'], x: 75, y: 80 }
  ]);
  
  const [currentLocation, setCurrentLocation] = useState('Camp');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [currentStoryEvents, setCurrentStoryEvents] = useState<string[]>([]);
  const [expandedSurvivor, setExpandedSurvivor] = useState<string | null>(null);

  // Action functions
  const handleExplore = () => {
    // Advance time
    setGameTime(prev => prev + 3);
    
    // Random event based on current location
    let eventText = '';
    let foodChange = 0;
    let medicineChange = 0;
    let moraleChange = 0;
    let hopeChange = 0;
    let hopeTarget = null;
    
    const events = [
      { text: "You found some supplies in the ruins.", food: 5, medicine: 0, morale: 0 },
      { text: "The forest is full of strange sounds.", food: 0, medicine: 0, morale: 0 },
      { text: "You discovered a hidden cache of food.", food: 5, medicine: 0, morale: 0 },
      { text: "You found some medicine in an old pharmacy.", food: 0, medicine: 1, morale: 0 },
      { text: "A survivor shared their thoughts and fears.", food: 0, medicine: 0, morale: 5 },
      { text: "You had a meaningful conversation with someone.", food: 0, medicine: 0, morale: 5 }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    eventText = randomEvent.text;
    
    // Apply changes
    setResources(prev => 
      prev.map(res => {
        if (res.name === 'Food') return { ...res, amount: Math.min(res.amount + randomEvent.food, res.max) };
        if (res.name === 'Medicine') return { ...res, amount: Math.min(res.amount + randomEvent.medicine, res.max) };
        if (res.name === 'Morale') return { ...res, amount: Math.min(res.amount + randomEvent.morale, res.max) };
        return res;
      })
    );
    
    // If it's a hope event, find a random survivor
    if (randomEvent.hope > 0) {
      const aliveSurvivors = survivors.filter(s => !s.dead);
      if (aliveSurvivors.length > 0) {
        const randomSurvivor = aliveSurvivors[Math.floor(Math.random() * aliveSurvivors.length)];
        hopeTarget = randomSurvivor.name;
        setSurvivors(prev => 
          prev.map(s => 
            s.name === hopeTarget ? { ...s, hope: Math.min(100, s.hope + 5) } : s
          )
        );
        eventText += ` ${hopeTarget} gained hope.`;
      }
    }
    
    // Add story event
    setCurrentStoryEvents(prev => {
      const newEvents = [...prev, eventText];
      return newEvents.slice(-5);
    });
  };

  const handleTravel = () => {
    if (!selectedDestination) return;
    
    // Check if destination is connected to current location
    const currentNode = mapNodes.find(n => n.name === currentLocation);
    const isAdjacent = currentNode?.connectedNodes.includes(selectedDestination);
    
    if (!isAdjacent) {
      setCurrentStoryEvents(prev => [...prev, "You cannot travel there directly."].slice(-5));
      return;
    }
    
    // Update current location
    setCurrentLocation(selectedDestination);
    
    // Advance time
    setGameTime(prev => prev + 6);
    
    // Consume food
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - 5) } : 
        res
      )
    );
    
    // Add story event
    setCurrentStoryEvents(prev => [...prev, `The group traveled to ${selectedDestination}.`].slice(-5));
    
    // Reveal one connected undiscovered node
    const currentMapNode = mapNodes.find(n => n.name === selectedDestination);
    if (currentMapNode) {
      const undiscoveredNodes = currentMapNode.connectedNodes.filter(nodeName => {
        const node = mapNodes.find(n => n.name === nodeName);
        return node && !node.discovered;
      });
      
      if (undiscoveredNodes.length > 0) {
        const randomUndiscovered = undiscoveredNodes[Math.floor(Math.random() * undiscoveredNodes.length)];
        setMapNodes(prev => 
          prev.map(node => 
            node.name === randomUndiscovered ? { ...node, discovered: true } : node
          )
        );
      }
    }
    
    // Check if any survivor reached their destination
    const reachedSurvivors = survivors.filter(s => !s.dead && s.destination === selectedDestination);
    if (reachedSurvivors.length > 0) {
      setSurvivors(prev => 
        prev.map(s => {
          if (reachedSurvivors.some(rs => rs.name === s.name)) {
            return { 
              ...s, 
              hope: Math.min(100, s.hope + 30),
              trust: Math.min(100, s.trust + 20)
            };
          }
          return s;
        })
      );
      
      const survivorNames = reachedSurvivors.map(s => s.name).join(', ');
      setCurrentStoryEvents(prev => [...prev, `${survivorNames} reached their Ithaca: ${selectedDestination}.`].slice(-5));
    }
    
    setSelectedDestination(null);
  };

  const handleTalk = () => {
    // Advance time
    setGameTime(prev => prev + 2);
    
    // Choose a random survivor
    const aliveSurvivors = survivors.filter(s => !s.dead);
    if (aliveSurvivors.length === 0) return;
    
    const randomSurvivor = aliveSurvivors[Math.floor(Math.random() * aliveSurvivors.length)];
    
    // Increase hope or trust
    const increaseType = Math.random() > 0.5 ? 'hope' : 'trust';
    const increaseValue = 5;
    
    setSurvivors(prev => 
      prev.map(s => {
        if (s.name === randomSurvivor.name) {
          return { 
            ...s, 
            [increaseType]: Math.min(100, s[increaseType] + increaseValue) 
          };
        }
        return s;
      })
    );
    
    // Add story event
    setCurrentStoryEvents(prev => [...prev, `${randomSurvivor.name} shared why they want to reach ${randomSurvivor.destination}.`].slice(-5));
  };

  const handleRest = () => {
    // Advance time
    setGameTime(prev => prev + 8);
    
    // Increase morale
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 10, res.max) } : 
        res
      )
    );
    
    // Consume food
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - 3) } : 
        res
      )
    );
    
    // Add story event
    setCurrentStoryEvents(prev => [...prev, "The group rested for the night."].slice(-5));
  };

  const handleEndTime = () => {
    // Advance to next day
    setGameTime(prev => prev + 24);
    
    // All survivors lose life
    setSurvivors(prev => 
      prev.map(s => {
        if (s.dead) return s;
        const newLife = Math.max(0, s.life - 1);
        if (newLife <= 0) {
          setCurrentStoryEvents(prevEvents => [...prevEvents, `${s.name} did not survive the night.`].slice(-5));
          return { ...s, life: 0, dead: true };
        }
        return { ...s, life: newLife };
      })
    );
    
    // Morale decreases
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.max(0, res.amount - 3) } : 
        res
      )
    );
    
    // Food consumption
    const foodConsumed = survivors.filter(s => !s.dead).length;
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - foodConsumed) } : 
        res
      )
    );
    
    // Add overnight event
    setCurrentStoryEvents(prev => [...prev, "The night passed quietly."].slice(-5));
  };

  // New function to select a destination
  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    
    // Update location panel with destination info
    const node = mapNodes.find(n => n.name === destination);
    if (node) {
      // Highlight the selected node
      setMapNodes(prev => 
        prev.map(n => 
          n.name === destination ? { ...n, highlighted: true } : { ...n, highlighted: false }
        )
      );
    }
  };

  // Function to handle map node click
  const handleNodeClick = (nodeName: string) => {
    if (nodeName === currentLocation) return;
    
    // Check if node is connected to current location
    const currentNode = mapNodes.find(n => n.name === currentLocation);
    const isAdjacent = currentNode?.connectedNodes.includes(nodeName);
    
    if (isAdjacent) {
      handleSelectDestination(nodeName);
    } else {
      setCurrentStoryEvents(prev => [...prev, "You cannot travel there directly."].slice(-5));
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white flex flex-col p-4 gap-3">
      {/* Top Bar */}
      <header className="h-20 bg-gray-800 rounded-lg flex items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold">Cozy Apocalypse v2</h1>
          <p className="text-gray-300 text-sm">Day {Math.floor(gameTime / 24)} - Time: {gameTime % 24} hours</p>
        </div>
        <div className="flex space-x-6">
          <div className="text-right">
            <p className="text-sm">Food: {resources[0].amount}</p>
            <p className="text-sm">Medicine: {resources[1].amount}</p>
            <p className="text-sm">Morale: {resources[2].amount}</p>
          </div>
        </div>
      </header>

      {/* Survivors Row */}
      <section className="shrink-0 min-h-[120px] max-h-[140px] bg-gray-800 rounded-lg p-2 overflow-x-auto overflow-y-hidden">
        <div className="flex space-x-3 min-w-max">
          {survivors.map(survivor => (
            <div 
              key={survivor.id} 
              className={`w-44 bg-gray-700 rounded-lg p-3 border ${survivor.dead ? 'border-gray-600 opacity-50' : 'border-gray-600'} flex flex-col`}
              style={{ height: '112px' }}
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3 font-bold">
                  {survivor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{survivor.name}</h3>
                  <p className="text-xs text-gray-300">{survivor.profession}</p>
                </div>
              </div>
              
              <div className="flex justify-between text-xs mb-1">
                <span>Life: {survivor.life}d</span>
                <span>H: {survivor.hope}%</span>
                <span>T: {survivor.trust}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 min-h-0 grid grid-cols-[1fr_320px] gap-3">
        {/* Map Panel */}
        <section className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Map</h2>
          
          <div className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
            {/* Map nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Old School */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Old School' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Old School'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Old School')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'school')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'school')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Old School')}
                >
                  🏫
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'school')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'school')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Old School
                </div>
                
                {/* Forest */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Forest' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Forest'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Forest')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'forest')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'forest')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Forest')}
                >
                  🌲
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'forest')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'forest')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Forest
                </div>
                
                {/* Camp */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Camp' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Camp'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Camp')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'camp')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Camp')}
                >
                  🏕️
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'camp')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Camp
                </div>
                
                {/* Hospital */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Hospital' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Hospital'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Hospital')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'hospital')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Hospital')}
                >
                  ✚
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'hospital')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Hospital
                </div>
                
                {/* Farm */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Farm' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Farm'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Farm')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'farm')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'farm')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Farm')}
                >
                  🌾
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'farm')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'farm')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Farm
                </div>
                
                {/* Bridge Site */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Bridge Site' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Bridge Site'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Bridge Site')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'bridge')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Bridge Site')}
                >
                  🌉
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'bridge')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Bridge Site
                </div>
                
                {/* Riverside */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Riverside' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Riverside'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Riverside')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'riverside')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Riverside')}
                >
                  🌊
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'riverside')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Riverside
                </div>
                
                {/* Harbor */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'Harbor' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'Harbor'
                        ? 'bg-yellow-600 border-yellow-400'
                        : mapNodes.find(n => n.name === 'Harbor')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(mapNodes.find(n => n.id === 'harbor')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('Harbor')}
                >
                  ⚓
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(mapNodes.find(n => n.id === 'harbor')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Harbor
                </div>
              </div>
            </div>
            
            {/* Current location indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
                <p className="text-sm font-bold">{currentLocation}</p>
              </div>
            </div>
          </div>
          
          {/* Selected destination indicator */}
          {selectedDestination && (
            <div className="mt-4 bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm">Selected: {selectedDestination}</p>
              <p className="text-xs text-gray-300 mt-1">Click Travel to move here</p>
            </div>
          )}
        </section>

        {/* Location Panel */}
        <aside className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          
          <div>
            <h3 className="text-lg font-bold mb-2">{currentLocation}</h3>
            
            {currentLocation === 'Camp' ? (
              <p className="text-gray-300 mb-4">Your base of operations. A small shelter built from scavenged materials.</p>
            ) : currentLocation === 'Forest' ? (
              <p className="text-gray-300 mb-4">A dense forest with tall trees and thick undergrowth. The air is thick with mystery.</p>
            ) : currentLocation === 'Hospital' ? (
              <p className="text-gray-300 mb-4">A crumbling hospital building with broken windows and a faded sign.</p>
            ) : currentLocation === 'Old School' ? (
              <p className="text-gray-300 mb-4">An old school building with broken windows and a faded sign.</p>
            ) : currentLocation === 'Farm' ? (
              <p className="text-gray-300 mb-4">An abandoned farm with overgrown fields and broken fences.</p>
            ) : currentLocation === 'Riverside' ? (
              <p className="text-gray-300 mb-4">A quiet riverside with a small bridge and clear water.</p>
            ) : currentLocation === 'Bridge Site' ? (
              <p className="text-gray-300 mb-4">A site where a bridge was built, now overgrown with vegetation.</p>
            ) : currentLocation === 'Harbor' ? (
              <p className="text-gray-300 mb-4">A quiet harbor with boats and a lighthouse.</p>
            ) : (
              <p className="text-gray-300 mb-4">Unknown location.</p>
            )}
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Story Events</h4>
              {currentStoryEvents.length > 0 ? (
                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600 text-sm">
                  {currentStoryEvents.map((event, index) => (
                    <p key={index} className="mb-1 last:mb-0">{event}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No events yet</p>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Destination</h4>
              <p className="text-gray-300">{survivors.find(s => s.name === currentLocation)?.destination || 'No destination'}</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Action Bar */}
      <footer className="h-20 bg-gray-800 rounded-lg flex items-center justify-center space-x-4 sticky bottom-0">
        <button 
          onClick={handleExplore}
          className="action-button"
        >
          Explore
        </button>
        <button 
          onClick={handleTravel}
          disabled={!selectedDestination}
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
      </footer>
    </div>
  );
}

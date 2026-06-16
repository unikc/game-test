'use client';

import { useState } from 'react';

export default function Home() {
  const [gameTime, setGameTime] = useState(0);
  const [resources, setResources] = useState([
    { name: 'Food', amount: 50, max: 100 },
    { name: 'Medicine', amount: 20, max: 50 },
    { name: 'Morale', amount: 60, max: 100 }
  ]);
  
  const [survivors] = useState([
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
  ]);
  
  const [mapNodes] = useState([
    { id: 'camp', name: 'Camp', discovered: true, visited: true, emoji: '🏕️', connectedNodes: ['forest', 'hospital'] },
    { id: 'forest', name: 'Forest', discovered: false, visited: false, emoji: '🌲', connectedNodes: ['camp', 'hospital'] },
    { id: 'hospital', name: 'Hospital', discovered: false, visited: false, emoji: '✚', connectedNodes: ['forest', 'school'] },
    { id: 'school', name: 'Old School', discovered: false, visited: false, emoji: '🏫', connectedNodes: ['town', 'hospital', 'farm'] },
    { id: 'farm', name: 'Farm', discovered: false, visited: false, emoji: '🌾', connectedNodes: ['school', 'riverside'] },
    { id: 'riverside', name: 'Riverside', discovered: false, visited: false, emoji: '🌊', connectedNodes: ['farm', 'harbor'] },
    { id: 'bridge', name: 'Bridge Site', discovered: false, visited: false, emoji: '🌉', connectedNodes: ['riverside'] },
    { id: 'harbor', name: 'Harbor', discovered: false, visited: false, emoji: '⚓', connectedNodes: ['riverside'] }
  ]);
  
  const [currentLocation, setCurrentLocation] = useState('Camp');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [currentStoryEvent, setCurrentStoryEvent] = useState<string | null>(null);
  const [expandedSurvivor, setExpandedSurvivor] = useState<string | null>(null);

  // Action functions
  const handleExplore = () => {
    // Simulate exploring and finding resources
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.min(res.amount + 5, res.max) } : 
        res.name === 'Medicine' ? { ...res, amount: Math.min(res.amount + 2, res.max) } : 
        res
      )
    );
    
    // Add a story event
    const events = [
      "You found some supplies in the ruins.",
      "The forest is full of strange sounds.",
      "You discovered a hidden cache of food."
    ];
    setCurrentStoryEvent(events[Math.floor(Math.random() * events.length)]);
  };

  const handleTravel = () => {
    if (!selectedDestination) return;
    
    // Update current location
    setCurrentLocation(selectedDestination);
    
    // Mark destination as visited
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - 1) } : 
        res
      )
    );
    
    // Add a story event
    const events = [
      "The journey was long but rewarding.",
      "You found a new path through the wilderness.",
      "The landscape changed as you traveled."
    ];
    setCurrentStoryEvent(events[Math.floor(Math.random() * events.length)]);
    
    setSelectedDestination(null);
  };

  const handleTalk = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 5, res.max) } : 
        res
      )
    );
    
    // Add a story event
    const events = [
      "The group shared their thoughts and fears.",
      "You had a meaningful conversation with someone.",
      "A survivor shared an old memory."
    ];
    setCurrentStoryEvent(events[Math.floor(Math.random() * events.length)]);
  };

  const handleRest = () => {
    setResources(prev => 
      prev.map(res => 
        res.name === 'Morale' ? { ...res, amount: Math.min(res.amount + 5, res.max) } : 
        res
      )
    );
    
    // Add a story event
    const events = [
      "You all rested and recovered.",
      "The night was peaceful.",
      "You felt a sense of calm."
    ];
    setCurrentStoryEvent(events[Math.floor(Math.random() * events.length)]);
  };

  const handleEndTime = () => {
    // Advance time
    setGameTime(prev => prev + 24);
    
    // Add a story event
    const events = [
      "The day passed quietly.",
      "You reflected on the journey.",
      "The sun set behind the horizon."
    ];
    setCurrentStoryEvent(events[Math.floor(Math.random() * events.length)]);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white flex flex-col p-4 gap-3">
      {/* Top Bar */}
      <header className="h-20 bg-gray-800 rounded-lg flex items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold">Cozy Apocalypse</h1>
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
      <section className="h-44 bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {survivors.map(survivor => (
            <div 
              key={survivor.id} 
              className="w-56 bg-gray-700 rounded-lg p-3 border border-gray-600 flex flex-col"
              style={{ height: '100px' }}
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
              
              <button 
                className="text-xs text-blue-400 mt-1"
                onClick={() => setExpandedSurvivor(expandedSurvivor === survivor.id ? null : survivor.id)}
              >
                {expandedSurvivor === survivor.id ? 'Show less' : 'Show more'}
              </button>
              
              {expandedSurvivor === survivor.id && (
                <div className="mt-2 text-xs">
                  <p className="italic text-gray-300">"{survivor.dream}"</p>
                  <p className="text-gray-400">Destination: {survivor.destination}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 min-h-0 grid grid-cols-[1fr_320px] gap-3">
        {/* Map Panel */}
        <section className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Map</h2>
          
          <div className="relative w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden">
            {/* Grid-based map layout */}
            <div className="grid grid-cols-3 grid-rows-5 gap-4 w-full h-full p-8">
              {/* Row 1 - Old School */}
              <div></div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Old School' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🏫
                </button>
              </div>
              <div></div>
              
              {/* Row 2 - Forest, Camp, Hospital */}
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Forest' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🌲
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Camp' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🏕️
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Hospital' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  ✚
                </button>
              </div>
              
              {/* Row 3 - Farm */}
              <div></div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Farm' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🌾
                </button>
              </div>
              <div></div>
              
              {/* Row 4 - Riverside, Bridge Site */}
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Riverside' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🌊
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Bridge Site' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  🌉
                </button>
              </div>
              <div></div>
              
              {/* Row 5 - Harbor */}
              <div></div>
              <div className="flex justify-center items-center">
                <button
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 ${
                    currentLocation === 'Harbor' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  ⚓
                </button>
              </div>
              <div></div>
            </div>
            
            {/* Connection lines */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Horizontal connections */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-gray-500"></div>
              <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-gray-500"></div>
              <div className="absolute top-3/4 left-1/4 w-1/2 h-1 bg-gray-500"></div>
              
              {/* Vertical connections */}
              <div className="absolute top-1/4 left-1/2 w-1 h-1/2 bg-gray-500"></div>
              <div className="absolute top-1/4 left-1/3 w-1 h-1/2 bg-gray-500"></div>
              <div className="absolute top-1/4 left-2/3 w-1 h-1/2 bg-gray-500"></div>
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

'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [gameTime, setGameTime] = useState(0);
  const [winterCountdown, setWinterCountdown] = useState(30);
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
      dead: false,
      fulfilled: false,
      dreamFulfilled: false
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
      dead: false,
      fulfilled: false,
      dreamFulfilled: false
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
      dead: false,
      fulfilled: false,
      dreamFulfilled: false
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
      destination: 'Riverside',
      distanceToDestination: 20,
      dead: false,
      fulfilled: false,
      dreamFulfilled: false
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
      destination: 'Harbor',
      distanceToDestination: 8,
      dead: false,
      fulfilled: false,
      dreamFulfilled: false
    }
  ]);
  
  const [mapNodes, setMapNodes] = useState([
    { id: 'camp', name: 'Camp', discovered: true, visited: true, emoji: '🏕️', connectedNodes: ['forest', 'hospital', 'farm'], x: 50, y: 30, remainingSupplies: null },
    { id: 'forest', name: 'Forest', discovered: false, visited: false, emoji: '🌲', connectedNodes: ['camp', 'riverside'], x: 20, y: 30, remainingSupplies: 50, danger: 'low' },
    { id: 'hospital', name: 'Hospital', discovered: false, visited: false, emoji: '✚', connectedNodes: ['camp'], x: 80, y: 30, remainingSupplies: 40, danger: 'high' },
    { id: 'school', name: 'Old School', discovered: false, visited: false, emoji: '🏫', connectedNodes: ['camp'], x: 50, y: 10, remainingSupplies: 30, danger: 'low' },
    { id: 'farm', name: 'Farm', discovered: false, visited: false, emoji: '🌾', connectedNodes: ['camp', 'riverside'], x: 40, y: 55, remainingSupplies: 60, danger: 'low' },
    { id: 'riverside', name: 'Riverside', discovered: false, visited: false, emoji: '🌊', connectedNodes: ['farm', 'bridge'], x: 25, y: 80, remainingSupplies: 45, danger: 'medium' },
    { id: 'bridge', name: 'Bridge Site', discovered: false, visited: false, emoji: '🌉', connectedNodes: ['riverside', 'harbor'], x: 60, y: 55, remainingSupplies: 35, danger: 'medium' },
    { id: 'harbor', name: 'Harbor', discovered: false, visited: false, emoji: '⚓', connectedNodes: ['bridge'], x: 75, y: 80, remainingSupplies: 55, danger: 'medium' }
  ]);
  
  const [currentLocation, setCurrentLocation] = useState('camp');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [currentStoryEvents, setCurrentStoryEvents] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedSurvivor, setExpandedSurvivor] = useState<string | null>(null);

  // Travel times between locations
  const travelTimes = {
    'camp': { 
      'forest': 2, 
      'hospital': 2, 
      'farm': 1,
      'school': 5
    },
    'forest': { 'camp': 2, 'riverside': 3 },
    'hospital': { 'camp': 2 },
    'school': { 'camp': 5 },
    'farm': { 'camp': 1, 'riverside': 3 },
    'riverside': { 'farm': 3, 'bridge': 2 },
    'bridge': { 'riverside': 2, 'harbor': 2 },
    'harbor': { 'bridge': 2 }
  };

  // Helper function to get node by ID
  const getNodeById = (id: string) => {
    return mapNodes.find(node => node.id === id);
  };

  // Get survivors at a location
  const getSurvivorsAtLocation = (locationId: string) => {
    return survivors.filter(survivor => 
      !survivor.dead && 
      (survivor.destination === getNodeById(locationId)?.name || locationId === currentLocation)
    ).map(s => s.name.charAt(0));
  };

  // Action functions
  const handleExplore = () => {
    // Advance time
    setGameTime(prev => prev + 3);
    
    // Get current node supplies
    const currentNode = getNodeById(currentLocation);
    if (!currentNode) return;
    
    // Check if supplies are depleted
    if (currentNode.remainingSupplies === 0) {
      setCurrentStoryEvents(prev => [...prev, "This area has been scavenged already."].slice(-10));
      return;
    }
    
    // Random event based on current location
    let eventText = '';
    let foodChange = 0;
    let medicineChange = 0;
    let moraleChange = 0;
    let hopeChange = 0;
    let injury = false;
    let infection = false;
    
    const events = {
      'forest': [
        { text: "The group found edible berries in the forest.", food: 10, medicine: 0, morale: 0, chance: 0.6 },
        { text: "They discovered a hidden cache of food.", food: 5, medicine: 0, morale: 0, chance: 0.2 },
        { text: "They got injured while exploring.", food: 0, medicine: -2, morale: 0, injury: true, chance: 0.2 }
      ],
      'hospital': [
        { text: "They found medicine in an old pharmacy.", food: 0, medicine: 10, morale: 0, chance: 0.5 },
        { text: "They found nothing useful.", food: 0, medicine: 0, morale: 0, chance: 0.3 },
        { text: "They caught an infection from a broken syringe.", food: 0, medicine: 0, morale: -5, infection: true, chance: 0.2 }
      ],
      'farm': [
        { text: "They found supplies in the abandoned farm.", food: 15, medicine: 0, morale: 0, chance: 0.7 },
        { text: "They found some old food.", food: 5, medicine: 0, morale: 0, chance: 0.2 },
        { text: "They got injured while working.", food: 0, medicine: -2, morale: 0, injury: true, chance: 0.1 }
      ],
      'harbor': [
        { text: "They found some useful items at the harbor.", food: 0, medicine: 0, morale: 5, chance: 0.5 },
        { text: "They found fuel for their supplies.", food: 0, medicine: 0, morale: 0, chance: 0.3 },
        { text: "They encountered a dangerous situation.", food: 0, medicine: 0, morale: -10, chance: 0.2 }
      ],
      'school': [
        { text: "They found old memories in the school building.", food: 0, medicine: 0, morale: 10, chance: 0.6 },
        { text: "The classrooms were filled with dust and silence.", food: 0, medicine: 0, morale: 0, chance: 0.3 },
        { text: "They found a hidden message in the school.", food: 0, medicine: 0, morale: 5, chance: 0.1 }
      ],
      'bridge': [
        { text: "They found scrap materials at the bridge site.", food: 0, medicine: 0, morale: 0, chance: 0.4 },
        { text: "They found nothing useful.", food: 0, medicine: 0, morale: 0, chance: 0.4 },
        { text: "They got injured while working on the bridge.", food: 0, medicine: -2, morale: 0, injury: true, chance: 0.2 }
      ],
      'riverside': [
        { text: "They found tracks in the mud by the river.", food: 0, medicine: 0, morale: 0, chance: 0.5 },
        { text: "The water was clear and peaceful.", food: 0, medicine: 0, morale: 5, chance: 0.3 },
        { text: "They found a small treasure by the river.", food: 0, medicine: 0, morale: 10, chance: 0.2 }
      ],
      'camp': [
        { text: "They explored around the camp.", food: 0, medicine: 0, morale: 0, chance: 0.6 },
        { text: "They found some old supplies.", food: 5, medicine: 0, morale: 0, chance: 0.3 },
        { text: "They got injured while exploring.", food: 0, medicine: -2, morale: 0, injury: true, chance: 0.1 }
      ]
    };
    
    const locationEvents = events[currentLocation] || [];
    if (locationEvents.length > 0) {
      // Weighted random selection
      let cumulativeChance = 0;
      const rand = Math.random();
      
      let selectedEvent = null;
      for (const event of locationEvents) {
        cumulativeChance += event.chance;
        if (rand <= cumulativeChance) {
          selectedEvent = event;
          break;
        }
      }
      
      if (selectedEvent) {
        eventText = selectedEvent.text;
        foodChange = selectedEvent.food || 0;
        medicineChange = selectedEvent.medicine || 0;
        moraleChange = selectedEvent.morale || 0;
        injury = selectedEvent.injury || false;
        infection = selectedEvent.infection || false;
        
        // Apply changes
        setResources(prev => 
          prev.map(res => {
            if (res.name === 'Food') return { ...res, amount: Math.min(res.amount + foodChange, res.max) };
            if (res.name === 'Medicine') return { ...res, amount: Math.min(res.amount + medicineChange, res.max) };
            if (res.name === 'Morale') return { ...res, amount: Math.min(res.amount + moraleChange, res.max) };
            return res;
          })
        );
        
        // Handle injury or infection
        if (injury || infection) {
          const injuryText = injury ? "They got injured while exploring." : "They caught an infection from a broken syringe.";
          setCurrentStoryEvents(prev => [...prev, injuryText].slice(-10));
        }
      }
    }
    
    // Reduce supplies
    setMapNodes(prev => 
      prev.map(node => {
        if (node.id === currentLocation) {
          const newSupplies = Math.max(0, node.remainingSupplies! - 1);
          return { ...node, remainingSupplies: newSupplies };
        }
        return node;
      })
    );
    
    // Add story event
    setCurrentStoryEvents(prev => {
      const newEvents = [...prev, eventText];
      return newEvents.slice(-10);
    });
  };

  const handleTravel = () => {
    if (!selectedDestination) {
      setCurrentStoryEvents(prev => [...prev, "Select a destination on the map first."].slice(-10));
      return;
    }
    
    if (selectedDestination === currentLocation) {
      setCurrentStoryEvents(prev => [...prev, "You are already here."].slice(-10));
      return;
    }
    
    // Check if destination is connected to current location
    const currentNode = getNodeById(currentLocation);
    const isAdjacent = currentNode?.connectedNodes.includes(selectedDestination);
    
    if (!isAdjacent) {
      setCurrentStoryEvents(prev => [...prev, "You cannot travel there directly."].slice(-10));
      return;
    }
    
    // Get travel time
    const travelTime = travelTimes[currentLocation]?.[selectedDestination] || 0;
    
    // Update current location
    setCurrentLocation(selectedDestination);
    
    // Advance time
    setGameTime(prev => prev + travelTime);
    
    // Consume food based on number of alive survivors and travel time
    const aliveSurvivors = survivors.filter(s => !s.dead).length;
    const foodConsumed = aliveSurvivors * travelTime;
    setResources(prev => 
      prev.map(res => 
        res.name === 'Food' ? { ...res, amount: Math.max(0, res.amount - foodConsumed) } : 
        res
      )
    );
    
    // Add story event
    const destinationName = getNodeById(selectedDestination)?.name || selectedDestination;
    setCurrentStoryEvents(prev => [...prev, `The group traveled to ${destinationName} in ${travelTime} hours.`].slice(-10));
    
    // Reveal one connected undiscovered node
    const currentMapNode = getNodeById(selectedDestination);
    if (currentMapNode) {
      const undiscoveredNodes = currentMapNode.connectedNodes.filter(nodeId => {
        const node = getNodeById(nodeId);
        return node && !node.discovered;
      });
      
      if (undiscoveredNodes.length > 0) {
        const randomUndiscovered = undiscoveredNodes[Math.floor(Math.random() * undiscoveredNodes.length)];
        setMapNodes(prev => 
          prev.map(node => 
            node.id === randomUndiscovered ? { ...node, discovered: true } : node
          )
        );
      }
    }
    
    // Check if any survivor reached their destination
    const reachedSurvivors = survivors.filter(s => !s.dead && s.destination === getNodeById(selectedDestination)?.name && !s.fulfilled);
    if (reachedSurvivors.length > 0) {
      setSurvivors(prev => 
        prev.map(s => {
          if (reachedSurvivors.some(rs => rs.name === s.name)) {
            return { 
              ...s, 
              hope: Math.min(100, s.hope + 30),
              trust: Math.min(100, s.trust + 20),
              fulfilled: true
            };
          }
          return s;
        })
      );
      
      const survivorNames = reachedSurvivors.map(s => s.name).join(', ');
      const memoryEvents = {
        'Elena': "The school feels smaller than she remembered.",
        'Marcus': "He stands quietly and watches the ocean.",
        'Sophie': "She finally sees the bridge completed.",
        'David': "He finds a clue about his daughter.",
        'James': "He paints one final sunset."
      };
      
      const memoryEvent = memoryEvents[reachedSurvivors[0].name] || `${survivorNames} reached their destination.`;
      setCurrentStoryEvents(prev => [...prev, `${survivorNames} reached their destination. ${memoryEvent}`].slice(-10));
    }
    
    // Check if survivor's dream is fulfilled
    const currentSurvivor = survivors.find(s => s.name === getNodeById(selectedDestination)?.name);
    if (currentSurvivor && !currentSurvivor.dreamFulfilled) {
      setSurvivors(prev => 
        prev.map(s => {
          if (s.name === currentSurvivor.name) {
            return { 
              ...s, 
              hope: Math.min(100, s.hope + 20),
              trust: Math.min(100, s.trust + 10),
              dreamFulfilled: true
            };
          }
          return s;
        })
      );
      
      setCurrentStoryEvents(prev => [...prev, `${currentSurvivor.name} fulfilled their dream! Hope +20, Trust +10.`].slice(-10));
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
    
    // Unique dialogue lines for each survivor
    const dialogues = {
      'Elena': [
        "I wonder if my classroom is still there.",
        "The school feels smaller than I remembered.",
        "I hope someone else found something good in here."
      ],
      'Marcus': [
        "I still want to see the ocean.",
        "The waves are so peaceful.",
        "I've always wanted to see the ocean one more time."
      ],
      'Sophie': [
        "I want to finish what I started.",
        "This bridge was supposed to be completed.",
        "I hope someone else will finish it for me."
      ],
      'David': [
        "I'm still looking for my daughter.",
        "I found a clue about her last night.",
        "She might be here somewhere."
      ],
      'James': [
        "I want to paint one more sunset.",
        "The colors are so beautiful at this time of day.",
        "This is the last sunset I'll paint."
      ]
    };
    
    const survivorDialogues = dialogues[randomSurvivor.name as keyof typeof dialogues] || ["I have something to say."];
    const randomDialogue = survivorDialogues[Math.floor(Math.random() * survivorDialogues.length)];
    
    // Increase hope
    const hopeIncrease = Math.floor(Math.random() * 3) + 1; // 1-3
    
    setSurvivors(prev => 
      prev.map(s => {
        if (s.name === randomSurvivor.name) {
          return { 
            ...s, 
            hope: Math.min(100, s.hope + hopeIncrease) 
          };
        }
        return s;
      })
    );
    
    // Add story event
    setCurrentStoryEvents(prev => [...prev, `${randomSurvivor.name}: "${randomDialogue}" Hope +${hopeIncrease}.`].slice(-10));
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
    setCurrentStoryEvents(prev => [...prev, "The group rested for the night."].slice(-10));
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
          setCurrentStoryEvents(prevEvents => [...prevEvents, `${s.name} passed away.`].slice(-10));
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
    
    // Check for food depletion
    if (resources[0].amount <= 0) {
      setResources(prev => 
        prev.map(res => 
          res.name === 'Morale' ? { ...res, amount: Math.max(0, res.amount - 10) } : 
          res
        )
      );
      
      // If morale is 0, random survivor loses hope
      if (resources[1].amount <= 0) {
        const aliveSurvivors = survivors.filter(s => !s.dead);
        if (aliveSurvivors.length > 0) {
          const randomSurvivor = aliveSurvivors[Math.floor(Math.random() * aliveSurvivors.length)];
          setSurvivors(prev => 
            prev.map(s => {
              if (s.name === randomSurvivor.name) {
                return { ...s, hope: Math.max(0, s.hope - 10) };
              }
              return s;
            })
          );
          setCurrentStoryEvents(prev => [...prev, `${randomSurvivor.name} lost hope due to lack of food.`].slice(-10));
        }
      }
    }
    
    // Add overnight event
    setCurrentStoryEvents(prev => [...prev, "The night passed quietly."].slice(-10));
  };

  // New function to select a destination
  const handleSelectDestination = (destinationId: string) => {
    setSelectedDestination(destinationId);
    
    // Update location panel with destination info
    const node = getNodeById(destinationId);
    if (node) {
      // Highlight the selected node
      setMapNodes(prev => 
        prev.map(n => 
          n.id === destinationId ? { ...n, highlighted: true } : { ...n, highlighted: false }
        )
      );
    }
  };

  // Function to handle map node click
  const handleNodeClick = (nodeId: string) => {
    if (nodeId === currentLocation) return;
    
    // Check if node is connected to current location
    const currentNode = getNodeById(currentLocation);
    const isAdjacent = currentNode?.connectedNodes.includes(nodeId);
    
    if (isAdjacent) {
      handleSelectDestination(nodeId);
    } else {
      setCurrentStoryEvents(prev => [...prev, "You cannot travel there directly."].slice(-10));
    }
  };

  // Check for winter countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setWinterCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          setShowSummary(true);
          return 0;
        }
        return prev - 1;
      });
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    
    return () => clearInterval(interval);
  }, []);

  // Render summary screen if game over
  if (showSummary) {
    const survivorsAlive = survivors.filter(s => !s.dead).length;
    const destinationsFulfilled = survivors.filter(s => s.fulfilled).length;
    
    return (
      <div className="h-screen overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-center p-4 gap-6">
        <h1 className="text-3xl font-bold">Game Over</h1>
        <p className="text-xl">Winter has arrived</p>
        
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          
          <div className="space-y-3">
            <p>Days survived: {Math.floor(gameTime / 24)}</p>
            <p>Survivors alive: {survivorsAlive}/5</p>
            <p>Destinations fulfilled: {destinationsFulfilled}/5</p>
            
            <h3 className="font-semibold mt-4">Major Events:</h3>
            <div className="bg-gray-700 rounded-lg p-3 text-sm">
              {currentStoryEvents.slice(-5).map((event, index) => (
                <p key={index} className="mb-1 last:mb-0">{event}</p>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="action-button bg-blue-600 hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    );
  }

  // Get danger color
  const getDangerColor = (danger: string) => {
    switch(danger) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Format story events as timeline
  const formatStoryEvents = () => {
    const formattedEvents = [];
    let currentDay = -1;
    
    for (let i = currentStoryEvents.length - 1; i >= 0; i--) {
      const event = currentStoryEvents[i];
      
      // Check if this is a day marker
      if (event.startsWith('Day ')) {
        formattedEvents.push(<p key={i} className="font-bold text-yellow-300">{event}</p>);
        continue;
      }
      
      // If we're at a new day, add the day header
      const eventDay = Math.floor((gameTime - 24 + i) / 24);
      if (eventDay !== currentDay) {
        currentDay = eventDay;
        formattedEvents.push(<p key={`day-${currentDay}`} className="font-bold text-yellow-300">Day {currentDay + 1}</p>);
      }
      
      formattedEvents.push(<p key={i} className="ml-2">{event}</p>);
    }
    
    return formattedEvents;
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
          <div className="text-right">
            <p className="text-sm">Winter in: {winterCountdown} days</p>
            <p className="text-sm">Dreams: {survivors.filter(s => s.dreamFulfilled).length}/{survivors.length}</p>
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
              
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-300">{survivor.destination}</span>
                {survivor.dreamFulfilled && (
                  <span className="text-yellow-400">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] gap-3">
        {/* Map Panel */}
        <section className="bg-gray-800 rounded-lg p-4 relative">
          <h2 className="text-xl font-semibold mb-4">Map</h2>
          
          <div className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {/* Camp connections */}
              <line x1={`${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'camp')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'forest')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'forest')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              <line x1={`${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'camp')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'hospital')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              <line x1={`${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'camp')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'farm')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'farm')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              
              {/* Forest connection */}
              <line x1={`${(mapNodes.find(n => n.id === 'forest')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'forest')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'riverside')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              
              {/* Farm connection */}
              <line x1={`${(mapNodes.find(n => n.id === 'farm')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'farm')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'riverside')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              <line x1={`${(mapNodes.find(n => n.id === 'farm')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'farm')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'bridge')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              
              {/* Riverside connection */}
              <line x1={`${(mapNodes.find(n => n.id === 'riverside')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'bridge')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              
              {/* Bridge connection */}
              <line x1={`${(mapNodes.find(n => n.id === 'bridge')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'harbor')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
              
              {/* School connection */}
              <line x1={`${(mapNodes.find(n => n.id === 'school')?.x ?? 0)}%`} y1={`${(mapNodes.find(n => n.id === 'school')?.y ?? 0)}%`} 
                    x2={`${(mapNodes.find(n => n.id === 'camp')?.x ?? 0)}%`} y2={`${(mapNodes.find(n => n.id === 'camp')?.y ?? 0)}%`}
                    stroke="gray" strokeWidth="1" />
            </svg>
            
            {/* Map nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Old School */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'school' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'school'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('school')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('school')?.x ?? 0)}%`, top: `${(getNodeById('school')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('school')}
                >
                  🏫
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('school')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'school')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Old School
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('school')?.danger || '')}`} style={{ left: `${(getNodeById('school')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'school')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('school')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('school')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'school')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('school').join('')}
                </div>
                
                {/* Forest */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'forest' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'forest'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('forest')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('forest')?.x ?? 0)}%`, top: `${(getNodeById('forest')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('forest')}
                >
                  🌲
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('forest')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'forest')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Forest
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('forest')?.danger || '')}`} style={{ left: `${(getNodeById('forest')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'forest')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('forest')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('forest')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'forest')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('forest').join('')}
                </div>
                
                {/* Camp */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'camp' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'camp'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('camp')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('camp')?.x ?? 0)}%`, top: `${(getNodeById('camp')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('camp')}
                >
                  🏕️
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('camp')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'camp')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Camp
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('camp')?.danger || '')}`} style={{ left: `${(getNodeById('camp')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'camp')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('camp')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('camp')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'camp')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('camp').join('')}
                </div>
                
                {/* Hospital */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'hospital' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'hospital'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('hospital')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('hospital')?.x ?? 0)}%`, top: `${(getNodeById('hospital')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('hospital')}
                >
                  ✚
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('hospital')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Hospital
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('hospital')?.danger || '')}`} style={{ left: `${(getNodeById('hospital')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('hospital')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('hospital')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'hospital')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('hospital').join('')}
                </div>
                
                {/* Farm */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'farm' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'farm'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('farm')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('farm')?.x ?? 0)}%`, top: `${(getNodeById('farm')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('farm')}
                >
                  🌾
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('farm')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'farm')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Farm
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('farm')?.danger || '')}`} style={{ left: `${(getNodeById('farm')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'farm')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('farm')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('farm')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'farm')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('farm').join('')}
                </div>
                
                {/* Bridge Site */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'bridge' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'bridge'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('bridge')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('bridge')?.x ?? 0)}%`, top: `${(getNodeById('bridge')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('bridge')}
                >
                  🌉
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('bridge')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Bridge Site
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('bridge')?.danger || '')}`} style={{ left: `${(getNodeById('bridge')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('bridge')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('bridge')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'bridge')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('bridge').join('')}
                </div>
                
                {/* Riverside */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'riverside' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'riverside'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('riverside')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('riverside')?.x ?? 0)}%`, top: `${(getNodeById('riverside')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('riverside')}
                >
                  🌊
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('riverside')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Riverside
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('riverside')?.danger || '')}`} style={{ left: `${(getNodeById('riverside')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('riverside')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('riverside')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'riverside')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('riverside').join('')}
                </div>
                
                {/* Harbor */}
                <button
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 z-10 ${
                    currentLocation === 'harbor' 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                      : selectedDestination === 'harbor'
                        ? 'bg-yellow-600 border-yellow-400'
                        : getNodeById('harbor')?.discovered
                          ? 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                          : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                  style={{ left: `${(getNodeById('harbor')?.x ?? 0)}%`, top: `${(getNodeById('harbor')?.y ?? 0)}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => handleNodeClick('harbor')}
                >
                  ⚓
                </button>
                <div className="absolute text-sm font-bold whitespace-nowrap" style={{ left: `${(getNodeById('harbor')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0) - 8}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  Harbor
                </div>
                <div className={`absolute text-xs font-bold ${getDangerColor(getNodeById('harbor')?.danger || '')}`} style={{ left: `${(getNodeById('harbor')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0) - 20}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  ⚠ {getNodeById('harbor')?.danger}
                </div>
                <div className="absolute text-xs" style={{ left: `${(getNodeById('harbor')?.x ?? 0)}%`, top: `${(mapNodes.find(n => n.id === 'harbor')?.y ?? 0) - 32}%`, transform: 'translateX(-50%)', zIndex: 20 }}>
                  {getSurvivorsAtLocation('harbor').join('')}
                </div>
              </div>
            </div>
            
            {/* Current location indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-600">
                <p className="text-sm font-bold">{getNodeById(currentLocation)?.name || currentLocation}</p>
              </div>
            </div>
          </div>
          
          {/* Selected destination indicator */}
          {selectedDestination && (
            <div className="mt-4 bg-gray-700 rounded-lg p-3 border border-gray-600">
              <p className="text-sm">Selected: {getNodeById(selectedDestination)?.name || selectedDestination}</p>
              {selectedDestination !== currentLocation && (
                <>
                  <p className="text-xs text-gray-300 mt-1">
                    Travel time: {travelTimes[currentLocation]?.[selectedDestination] || 0} hours
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        {/* Location Panel */}
        <aside className="bg-gray-800 rounded-lg p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          
          <div className="flex-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">{getNodeById(currentLocation)?.name || currentLocation}</h3>
              
              {currentLocation === 'camp' ? (
                <p className="text-gray-300 mb-4">Your base of operations. A small shelter built from scavenged materials.</p>
              ) : currentLocation === 'forest' ? (
                <p className="text-gray-300 mb-4">A dense forest with tall trees and thick undergrowth. The air is thick with mystery.</p>
              ) : currentLocation === 'hospital' ? (
                <p className="text-gray-300 mb-4">A crumbling hospital building with broken windows and a faded sign.</p>
              ) : currentLocation === 'school' ? (
                <p className="text-gray-300 mb-4">An old school building with broken windows and a faded sign.</p>
              ) : currentLocation === 'farm' ? (
                <p className="text-gray-300 mb-4">An abandoned farm with overgrown fields and broken fences.</p>
              ) : currentLocation === 'riverside' ? (
                <p className="text-gray-300 mb-4">A quiet riverside with a small bridge and clear water.</p>
              ) : currentLocation === 'bridge' ? (
                <p className="text-gray-300 mb-4">A site where a bridge was built, now overgrown with vegetation.</p>
              ) : currentLocation === 'harbor' ? (
                <p className="text-gray-300 mb-4">A quiet harbor with boats and a lighthouse.</p>
              ) : (
                <p className="text-gray-300 mb-4">Unknown location.</p>
              )}
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Danger Level</h4>
                <p className={`font-bold ${getDangerColor(getNodeById(currentLocation)?.danger || '')}`}>
                  {getNodeById(currentLocation)?.danger || 'Unknown'}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Supplies</h4>
                <p className="text-gray-300">
                  {getNodeById(currentLocation)?.remainingSupplies === 0 
                    ? "Depleted" 
                    : `Remaining: ${getNodeById(currentLocation)?.remainingSupplies}`}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Connected Locations</h4>
                {getNodeById(currentLocation)?.connectedNodes.map(nodeId => {
                  const node = getNodeById(nodeId);
                  return (
                    <div key={nodeId} className="flex justify-between text-sm">
                      <span>{node?.name}</span>
                      <span>{travelTimes[currentLocation]?.[nodeId] || 0}h</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Dreams</h4>
              <div className="space-y-1">
                {survivors.map(survivor => (
                  <div key={survivor.id} className="flex items-center text-sm">
                    <span className={`mr-2 ${survivor.dreamFulfilled ? 'text-green-400' : 'text-gray-300'}`}>
                      {survivor.dreamFulfilled ? '✓' : '□'}
                    </span>
                    <span>{survivor.name} → {survivor.destination}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Story Events</h4>
              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600 text-sm max-h-60 overflow-y-auto">
                {formatStoryEvents()}
              </div>
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

/**
 * Generates a deterministic or random "Adjective + Animal" name.
 * @param seed - Optional string to make the generation deterministic (e.g., user ID + room code).
 */
export function generateAlias(seed?: string): string {
  const adjectives = [
    "Sparkling", "Mystic", "Swift", "Silent", "Indigo", "Brave", 
    "Gracious", "Clever", "Vivid", "Radiant", "Calm", "Fierce",
    "Golden", "Silver", "Bright", "Epic", "Loyal", "Wise"
  ];

  const animals = [
    "Dolphin", "Panther", "Eagle", "Wolf", "Tiger", "Lion", 
    "Falcon", "Owl", "Fox", "Panda", "Koala", "Otter",
    "Phoenix", "Raven", "Bear", "Shark", "Dragon", "Stag"
  ];

  let adjIndex: number;
  let animalIndex: number;

  if (seed) {
    // Simple hash to convert string to a number
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const absHash = Math.abs(hash);
    adjIndex = absHash % adjectives.length;
    animalIndex = (absHash + adjectives.length) % animals.length;
  } else {
    adjIndex = Math.floor(Math.random() * adjectives.length);
    animalIndex = Math.floor(Math.random() * animals.length);
  }

  const adjective = adjectives[adjIndex];
  const animal = animals[animalIndex];

  return `${adjective} ${animal}`;
}

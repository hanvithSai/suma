/**
 * Generates a random "Adjective + Animal" name for anonymous participants.
 * Example: "Sparkling Dolphin", "Mystic Panther"
 */
export function generateAlias(): string {
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

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adjective} ${animal}`;
}

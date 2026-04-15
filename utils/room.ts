/**
 * Generates a random room code in the format XXX-XXX-XXX.
 * Example: AKD-KWB-WUG
 */
export function generateRoomCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const getRandomChunk = () => {
    let chunk = "";
    for (let i = 0; i < 3; i++) {
      chunk += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return chunk;
  };

  return `${getRandomChunk()}-${getRandomChunk()}-${getRandomChunk()}`;
}

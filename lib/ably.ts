import Ably from "ably";

/**
 * Create an Ably Realtime client.
 * 
 * Usage (client component):
 *   const ably = createAblyClient();
 *   const channel = ably.channels.get("room:ABC123");
 *   channel.subscribe("poll-update", (msg) => { ... });
 * 
 * The ABLY_API_KEY is server-only. For production, use token auth
 * via an API route instead of exposing the key to the browser.
 */

// Server-side Ably client (for API routes / server actions)
export const createAblyServerClient = () => {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ABLY_API_KEY environment variable");
  }
  return new Ably.Rest(apiKey);
};

// API route to issue Ably tokens for client-side usage
// Use this in an API route: /api/ably-token
export const createAblyTokenRequest = async (clientId?: string) => {
  const client = createAblyServerClient();
  
  // Presence requires a clientId. If not provided (guest mode), 
  // we generate a unique random one.
  const finalClientId = clientId || `guest-${Math.random().toString(36).substring(2, 10)}`;
  
  return await client.auth.createTokenRequest({ clientId: finalClientId });
};

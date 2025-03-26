// Simplified authentication management (no localStorage)

let isAuthenticated = false;
let username = "John Wick";

export function setLoggedIn() {
  isAuthenticated = true;
}

export function isLoggedIn(): boolean {
  return isAuthenticated;
}

export function getUsername(): string {
  return username;
}

export function logout() {
  isAuthenticated = false;
}

// Mock function for getting username from Google OAuth
export async function getUsernameFromGoogleOAuth(): Promise<string> {
  return username;
}

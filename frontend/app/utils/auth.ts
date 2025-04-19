// This is a simplified auth management for demonstration purposes.
// In a real application, you'd want to use a more secure method, possibly involving server-side sessions.

export function setLoggedIn(username: string) {
  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("username", username)
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true"
}

export function getUsername(): string | null {
  return localStorage.getItem("username")
}

export function logout() {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("username")
}

// This function is now client-side for demonstration
export async function getUsernameFromGoogleOAuth(): Promise<string> {
  // In a real app, this would involve a server call to verify the Google OAuth token
  // and retrieve the user's information
  return getUsername() || "John Doe"
}


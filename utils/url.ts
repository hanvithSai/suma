/**
 * utils/url.ts
 * 
 * Utility to determine the base URL of the application across different environments.
 * Prioritizes the current window origin in the browser to support branch previews.
 */

export const getURL = () => {
  // 1. Client-side: Always use the current origin if available.
  // This ensures the user stays on their specific branch preview (e.g. suma-git-fix-...).
  if (typeof window !== "undefined") {
    return window.location.origin.endsWith("/")
      ? window.location.origin
      : `${window.location.origin}/`;
  }

  // 2. Server-side: Determine URL from environment variables.
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  
  // Prod: https://suma-h.vercel.app/
  if (env === "production") {
    return "https://suma-h.vercel.app/";
  }

  // Preview: https://non-prod.suma-h.vercel.app/
  if (env === "preview") {
    return process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/` 
      : "https://non-prod.suma-h.vercel.app/";
  }

  // Local/Dev: http://localhost:3000/
  return "http://localhost:3000/";
};

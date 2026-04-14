/**
 * utils/url.ts
 * 
 * Utility to determine the base URL of the application across different environments.
 * Handles production, Vercel preview deployments, and local development.
 */

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel for previews and production.
    "http://localhost:3000/";
  
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  
  return url;
};

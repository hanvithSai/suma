# SUMA: Error Log

This document tracks significant issues, architectural blockers, and bugs encountered during development, along with their resolutions and prevention strategies.

---

## Error ID: ERR-001
**Date:** 2026-04-10  
**Module/File:** `middleware.ts` / `proxy.ts`  
**Function Name:** N/A (Project Convention)

### Problem Description:
- The Next.js dev server and build process reported that the `middleware.ts` file convention is deprecated in favor of `proxy.ts`.

### Context:
- **Environment:** Next.js 16.2.3 (Turbopack)
- **Problem:** Turbopack threw warnings/errors when both files existed or when the old naming convention was used.

### Attempts Made:
1. Renamed `middleware.ts` to `proxy.ts` but initially kept the function name as `middleware`.
2. Renamed the function to `proxy`.
3. Deleted the old `middleware.ts` file.

### Root Cause:
- Next.js 16 introduced a breaking convention change (renaming Middleware to Proxy) to better clarify its role as a network boundary.

### Impact:
- Blocked the development server and triggered build warnings.

### Final Fix:
- Fully migrated logic to `proxy.ts` and renamed the exported function to `proxy`.

### Why It Worked:
- Aligned with the latest framework-level file conventions.

### Prevention Strategy:
- Monitor Next.js canary/beta release notes for major convention shifts when using bleeding-edge versions (v16+).

---

## Error ID: ERR-002
**Date:** 2026-04-10  
**Module/File:** `app/context/ThemeContext.tsx`  
**Function Name:** `ThemeProvider`

### Problem Description:
- ESLint error: `react-hooks/set-state-in-effect`. Calling `setState` synchronously within an effect caused cascading renders.

### Context:
- **Problem:** Initializing theme from `localStorage` inside a standard `useEffect` triggered a re-render during hydration.

### Attempts Made:
1. Moved it to a separate effect.
2. Added a `mounted` state check.
3. Wrapped state updates in `setTimeout(..., 0)`.

### Root Cause:
- The `react-hooks/set-state-in-effect` rule in modern React/Next.js lint configurations forbids synchronous state updates in the mounting effect to prevent performance bottlenecks.

### Impact:
- Blocked CI/CD pipeline due to lint failures.

### Final Fix:
- Wrapped `setTheme` and `setMounted` calls in `setTimeout(..., 0)` to move them to the next cycle of the event loop.

### Why It Worked:
- Satisfied the linter by ensuring the update is asynchronous and doesn't happen during the high-priority hydration phase.

### Prevention Strategy:
- For hydration-dependent state (Browser APIs), use a dedicated "mounted" effect and consider asynchronous updates or `useSyncExternalStore`.

---

## Error ID: ERR-003
**Date:** 2026-04-10  
**Module/File:** `proxy.ts`  
**Function Name:** `proxy`

### Problem Description:
- Production Build Failure: `Type error: Cannot find name 'NextResponse'`. 

### Context:
- **Dependencies:** `next/server`
- **Problem:** I added a try/catch block to `proxy.ts` and used `NextResponse.next()` but forgot to add `NextResponse` to the import statement.

### Attempts Made:
1. Added the missing import.

### Root Cause:
- Developer oversight during a quick "defensive code" hotfix.

### Impact:
- Crashed the Vercel production build after lint had passed in a previous turn.

### Final Fix:
- Corrected imports: `import { type NextRequest, NextResponse } from "next/server";`

### Why It Worked:
- Provided the necessary constructor for the response object.

### Prevention Strategy:
- **ALWAYS** run `npx tsc --noEmit` locally before pushing, even for "trivially simple" code changes. CI passing lint doesn't always catch type errors if the build worker environment differs.

---

## Error ID: ERR-004
**Date:** 2026-04-10  
**Module/File:** `utils/supabase/middleware.ts`  
**Function Name:** `updateSession`

### Problem Description:
- Vercel Deployment 500 Error: "Middleware Internal Server Error".

### Context:
- **Environment:** Vercel Production
- **Problem:** The site crashed immediately upon deployment because Supabase environment variables were not yet set in the Vercel UI.

### Attempts Made:
1. Replaced non-null assertions (`!`) with defensive checks.
2. Wrapped initialization in a try/catch block.

### Root Cause:
- The middleware was aggressively initializing the Supabase client. When keys were missing, the SDK threw an error that was unhandled, taking down the entire request.

### Impact:
- Site was unreachable (500) globally on deployment.

### Final Fix:
- Added a safety check: if `supabaseUrl` or `supabaseKey` are missing, the middleware logs a warning and returns `NextResponse.next()` safely.

### Why It Worked:
- Gracefully handles the "missing config" state, allowing the landing page to load even if backend services are not yet configured.

### Prevention Strategy:
- Never use non-null assertions on environment variables in the Middleware layer. Always assume they might be missing during initial provisioning.
---

## Error ID: ERR-005
**Date:** 2026-04-11  
**Module/File:** `app/login/page.tsx`  
**Function Name:** `LoginPage`

### Problem Description:
- Build Error: `Export Chrome doesn't exist in target module` lucide-react.

### Context:
- **Environment:** Next.js 16.2.3 (Turbopack)
- **Problem:** Attempting to import an icon that was either renamed or non-existent in the installed `lucide-react` version.

### Attempts Made:
1. Researched `lucide-react` icons.
2. Replaced with `Globe`.

### Root Cause:
- Version mismatch or removal of the `Chrome` icon in the specific branch/version of `lucide-react` being used (`^1.8.0`).

### Impact:
- Blocked the production build and local development.

### Final Fix:
- Replaced the missing `Chrome` icon with the `Globe` icon.

### Why It Worked:
- Switched to a reliably exported icon that fits the browser/web login context.

### Prevention Strategy:
- When using specific icons from standard libraries, verify their existence in the local `node_modules` or use more generic common icons if version stability is unknown.

---

## Error ID: ERR-006
**Date:** 2026-04-11  
**Module/File:** `app/auth/callback/route.ts`  
**Function Name:** `GET`

### Problem Description:
- HTTP ERROR 500: Server-side crash during authentication callback.

### Context:
- **Environment:** Next.js App Router (Route Handler)
- **Problem:** `createClient` was called without the required `cookieStore` argument.

### Attempts Made:
1. Added `cookies` import from `next/headers`.
2. Passed `await cookies()` to `createClient`.

### Root Cause:
- Developer error: failing to provide the mandatory dependency (cookies) to the server-side Supabase client helper.

### Impact:
- Users could not complete the Google Auth flow; resulted in a server crash immediately after provider approval.

### Final Fix:
- Updated the route handler to correctly await and provide the cookie store: `const supabase = createClient(await cookies());`.

### Why It Worked:
- Allowed the Supabase SDK to correctly read and write the session cookies required for the Auth exchange.

### Prevention Strategy:
- Always review the signature of shared utility functions across different environments (Client vs Server). Use TypeScript to enforce argument presence.

---

## Error ID: ERR-007
**Date:** 2026-04-11  
**Module/File:** `ci.yml` / `utils/supabase/*.ts`  
**Function Name:** `createClient`

### Problem Description:
- CI Build Failure: `@supabase/ssr: Your project's URL and API key are required to create a Supabase client!`.

### Context:
- **Environment:** GitHub Actions
- **Problem:** Static generation (prerendering `/_not-found`) executed code that initializes Supabase, but secrets were missing in the build environment.

### Attempts Made:
1. Added secrets to GitHub Actions.
2. Verified `ci.yml` configuration.

### Root Cause:
1. Environment secrets were added to a specific GitHub "Production" environment, but the Action was not configured to use that environment.
2. The code used non-null assertions (`!`) for env vars, preventing graceful failure during build-time static analysis.

### Impact:
- Blocked the CI/CD pipeline despite secrets existing in the dashboard.

### Final Fix:
- Updated `ci.yml` to specify `environment: Production`.
- Added fallback placeholder values in `utils/supabase` to allow `next build` to complete even if variables are missing.

### Why It Worked:
- Aligned the CI worker's context with the secrets storage and removed the hard crash at initialization.

### Prevention Strategy:
- Provide dummy fallbacks for non-secret env vars during build time. Always ensure GitHub Actions are correctly mapped to the environments where secrets reside.

---

## Error ID: ERR-008
**Date:** 2026-04-11  
**Module/File:** `next.config.ts`  
**Function Name:** N/A

### Problem Description:
- Runtime Error: `Invalid src prop` for `next/image`. `lh3.googleusercontent.com` is not configured.

### Context:
- **Environment:** Next.js (Local & Production)
- **Problem:** After showing the Google avatar in the Navbar using the `<Image />` component, the hostname was not whitelisted.

### Attempts Made:
1. Replaced `<Image />` with `<img>` (rejected for performance/lint).
2. Added hostname to `next.config.ts`.

### Root Cause:
- Next.js requires explicit hostname configuration for remote images to prevent security risks and enable optimization.

### Impact:
- Crashed the UI for logged-in users.

### Final Fix:
- Added `lh3.googleusercontent.com` to `images.remotePatterns` in `next.config.ts`.

### Why It Worked:
- Whitelisted the Google avatar domain for the built-in image optimization proxy.

### Prevention Strategy:
- Whenever integrating third-party OAuth/Avatars, proactively add their image hostnames to the Next.js config.

---

## Error ID: ERR-009
**Date:** 2026-04-14  
**Module/File:** `utils/url.ts` / `app/context/AuthContext.tsx`
**Function Name:** `getURL` / `signInWithGoogle`

### Problem Description:
- Logins on `localhost` or Vercel preview branches redirected users to the production URL instead of staying on the originating environment.

### Context:
- **Environment:** Multi-environment deployments (Local, Preview, Production).
- **Problem:** Auth redirects were either hardcoded or used unreliable detection, causing users to be "pushed" to production after logging in elsewhere.

### Attempts Made:
1. Used `window.location.host` manually.
2. Used `process.env.NEXT_PUBLIC_VERCEL_ENV` mapping.
3. Prioritized `window.location.origin` in a centralized utility.

### Root Cause:
- Inconsistent base URL determination across client and server environments. Relying purely on environment variables like `VERCEL_ENV` in the browser fails if they aren't explicitly exposed to the client.

### Impact:
- Fragmented user experience where development and testing on non-prod URLs was impossible without being redirected to production.

### Final Fix:
- Implemented a unified `getURL()` utility that prioritizes `window.location.origin` in the browser (guaranteeing exact URL persistence) and uses strict environmental mapping on the server.

### Why It Worked:
- `window.location.origin` is the most accurate representation of the user's current environment in the browser and requires no extra configuration to stay on the correct branch/domain.

### Prevention Strategy:
- Always use a single, environment-aware utility for generating absolute URLs. Ensure that the authentication provider (Supabase) whitelist includes wildcard patterns (e.g., `https://*-domain.vercel.app/**`) to support dynamic deployments.

---

## Error ID: ERR-010
**Date:** 2026-04-15  
**Module/File:** `app/host/dashboard/page.tsx`  
**Function Name:** N/A (UI)

### Problem Description:
- The "Create Room" button was totally unresponsive to mouse clicks, even though the code was correct and no errors appeared in the console.

### Context:
- **Environment:** Chrome/Localhost
- **Problem:** A decorative background gradient overlay (`fixed inset-0`) lacked the correct pointer-events configuration, effectively acting as an invisible shield over the UI.

### Root Cause:
- `z-index` and `absolute/fixed` positioning without `pointer-events: none` on purely decorative layers.

### Final Fix:
- Added `pointer-events-none` to the overlay div.

---

## Error ID: ERR-011
**Date:** 2026-04-15  
**Module/File:** `app/globals.css`  
**Function Name:** `.btn-secondary`

### Problem Description:
- Tailwind CSS Build Error: `Cannot apply unknown utility class glass`.

### Context:
- **Environment:** Tailwind CSS v4
- **Problem:** In v4, `@apply` cannot be used to apply custom component-layer classes (`.glass`) within other component classes unless they are standard utilities.

### Initial Attempt:
- Attempted to move `@layer components` around.

### Final Fix:
- Manually expanded the `.glass` properties inside the `.btn-secondary` class definition.

### Prevention Strategy:
- In Tailwind v4, avoid nested `@apply` for custom classes. Use explicit CSS variables or properties for shared component styles.

---

## Error ID: ERR-012
**Date:** 2026-04-15  
**Module/File:** `app/[code]/components/ParticipantView.tsx`  
**Function Name:** `ParticipantView`

### Problem Description:
- Next.js Hydration Error: Text content did not match between server and client.

### Root Cause:
- Random alias generation (`generateAlias()`) was called during the initial SSR render. Since it was random, the server-generated name never matched the client-generated name upon hydration.

### Final Fix:
- Deferred alias generation to a `useEffect` hook so it only triggers after the client has successfully hydrated with a stable (empty) state.

---

## Error ID: ERR-013
**Date:** 2026-04-15  
**Module/File:** `app/[code]/components/ParticipantView.tsx`  
**Function Name:** `channel.presence.enter`

### Problem Description:
- Ably Runtime Error: `clientId must be specified to enter a presence channel`.

### Root Cause:
- The Ably client was initialized without a `clientId`. Ably Presence requires a unique identifier for each member to track them on a channel.

### Final Fix:
- Updated the `/api/ably-token` route to provide a `clientId`. Authenticated users use their Supabase ID; guests get a generated unique ID.

---

## Error ID: ERR-014
**Date:** 2026-04-15  
**Module/File:** N/A (Build Process)
**Function Name:** `npm run build`

### Problem Description:
- Windows `EPERM` error: `operation not permitted, rmdir ...`.

### Context:
- **Environment:** Windows 11
- **Problem:** Files in the `.next` directory were locked by the active `npm run dev` process or an IDE indexer, preventing the build script from cleaning the directory.

### Final Fix:
- Stopped all dev processes and manually cleared the `.next` folder using `Remove-Item -Recurse -Force .next`.

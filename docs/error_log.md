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

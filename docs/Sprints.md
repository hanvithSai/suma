## 5. Sprint Roadmap

### Sprint 0: Setup & Infrastructure
- **Goal:** Establish the technical foundation and development environment.
- **Status:** ✅ Completed - [Live Deployment](https://suma-h.vercel.app/)
- **Features:**
    - Initialize Next.js project with TypeScript and Tailwind CSS. ✅ *[Completed: 2026-04-10 11:30 IST]*
    - Setup Database (Supabase/PostgreSQL) and Auth providers (Google Auth). ✅ *[Completed: 2026-04-10 12:45 IST]*
    - Configure Real-time infrastructure (Ably/WebSockets). ✅ *[Completed: 2026-04-10 14:15 IST]*
    - Establish CI/CD pipeline and Vercel deployment environment. ✅ *[Completed: 2026-04-10 16:30 IST]*
    - Design and develop a premium, responsive landing page. ✅ *[Completed: 2026-04-10 18:15 IST]*
    - Proxy migration & security hardening. ✅ *[Completed: 2026-04-10 19:15 IST]*

### Sprint 1: Foundation (Current)
    - Google Auth integration. ✅ *[Completed: 2026-04-11 23:45 IST]*
- ✅ **Feature 2: Dynamic Room Creation**  *[Completed: 2026-04-15 21:30 IST]*
- [ ] **Feature 3: Real-time PDF Viewer/Sync**
- [ ] **Feature 4: Standard Poll creation and voting.**
- [ ] **Feature 5: Basic chat functionality for participants.**

### Sprint 2: Engagement Layer
- **Goal:** Implement the "Fun" factor to drive user interaction.
- **Features:** 
    - Real-time Leaderboards for polls/quizzes.
    - Reaction Bursts (emojis/floating reactions).
    - Alias System for anonymous participation.

### Sprint 3: Security & Moderation
- **Goal:** Harden the platform for 10k+ concurrent users and ensure safety.
- **Features:** 
    - Automated Spam Filter for chat.
    - Co-Host roles and permission management.
    - Rate limiting for API and socket connections.
    - Advanced session management and logging.

---

## 6. Product Backlog (Prioritized)

1.  **[High]** QR Code generation for instant room joining.
2.  **[High]** "Speedster" Bonus logic for Quizzes (faster answers get more points).
3.  **[Med]** Dark/Light mode persistent theme toggle.
4.  **[Med]** In-chat GIF and Sticker support.
5.  **[Low]** Live PDF annotation (Ink support).
6.  **[Low]** Exportable post-event reports (CSV/PDF).

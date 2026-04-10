# SUMA: Product Documentation

## 1. Vision & Core Value
**SUMA** (Sanskrit for "Flower" or "Purity", and an acronym for **S**eamless **U**niversal **M**eeting **A**ssistant) aims to humanize large-scale digital interactions. Our goal is to make a 1,000,000-person event feel as intimate as a small seminar by removing barriers to participation.

## 2. Target Audience
- **Educators & Professors:** Managing university-wide lectures.
- **Corporate Leaders:** Conducting Town Halls and AGMs.
- **Keynote Speakers:** Engaging massive audiences in stadiums or digital streams.

---

## 3. Product Features & Requirements

### 3.1 Document Sharing (Zero-Switch)
- **Host Capability:** Upload PDF/PPT directly.
- **Audience Sync:** Automatic slide following.
- **Backlog Item:** Add support for real-time laser pointer sync.

### 3.2 Interactive Quizzes (Engagement Engine)
- **MCQ & MCQ+:** Multiple choice with multiple correct answers.
- **Voice/Audio Quiz:** Voice recognition for verbal answers.
- **Leaderboard:** Live ranking with speed-based point calculation.

### 3.3 Live Polls & Sentiment
- **Real-time Visualization:** Dynamic Bar/Pie charts.
- **Word Clouds:** For open-ended feedback.
- **Reaction Bursts:** Floating emojis (Like, LOL, Boo).

### 3.4 Community & Moderation
- **Filtered Chat:** Automated toxicity and spam filtering.
- **Alias System:** Anonymity via "Spirit Animals" (e.g., *RadiantPanda*, *SleepySnake*).
- **Q&A Queue:** Priority voting for audience questions.

---

## 4. User Stories

| ID | User Role | Requirement | Goal / Benefit |
| :--- | :--- | :--- | :--- |
| US.1 | Participant | Join a room with a 6-digit PIN | Ease of entry without friction. |
| US.2 | Host | Upload a PDF and present in-app | Stay focused on the audience, not the tools. |
| US.3 | Participant | Respond anonymously as an alias | Overcome the fear of the spotlight. |
| US.4 | Co-Host | Delete spam from the chat | Ensure a safe and clean environment. |
| US.5 | SuperAdmin | View cross-event engagement stats | Analyze platform growth and stickiness. |

---

## 5. Sprint Roadmap

### Sprint 0: Setup & Infrastructure
- **Goal:** Establish the technical foundation.
- **Features:** Supabase/Ably config, Tailwind v4 migration, Vercel deployment, and Premium Landing Page.

### Sprint 1: Foundation (The MVP)
- **Goal:** Get a Host and 10 Participants in a room with a working PDF and Polls.
- **Features:** Google Auth, PDF Viewer, Standard Poll, Basic Chat.

### Sprint 2: Engagement Layer
- **Goal:** Implement the "Fun" factor.
- **Features:** Leaderboards, Reaction Bursts, Alias System.

### Sprint 3: Security & Moderation
- **Goal:** Harden the platform for 10k+ users.
- **Features:** Spam Filter, Co-Host role, Rate limiting.

---

## 6. Product Backlog (Prioritized)

1.  **[High]** QR Code generation for instant room joining.
2.  **[High]** "Speedster" Bonus logic for Quizzes.
3.  **[Med]** Dark/Light mode persistent theme toggle.
4.  **[Med]** In-chat GIF and Sticker support.
5.  **[Low]** Live PDF annotation (Ink support).
6.  **[Low]** Exportable post-event reports (CSV/PDF).

---

## 7. Success Metrics
- **Joining Speed:** Average time from "Scan" to "Active" < 3 seconds.
- **Interaction Depth:** Average interactions per user per event > 5.
- **Retention:** % of Hosts who create more than 2 events.

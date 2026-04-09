# Product Requirements Document (PRD): SUMA (Engagement Platform)

## 1. Executive Summary
**SUMA** is a robust, real-time engagement platform designed to bridge the gap between speakers and audiences in large-scale events (up to 1 Million concurrent users). By integrating presentation materials, interactive quizzes, live polls, and filtered chat into a single, seamless, and **highly responsive** interface, SUMA eliminates engagement friction.

## 2. Problem Statement
In large crowds (1,000 to 1,000,000+ people), traditional interaction is broken:
- **Audibility/Visibility:** People in the back feel disconnected.
- **Participation Anxiety:** Fear of the spotlight prevents meaningful questions.
- **Context Switching:** Speakers lose momentum when switching between PPTs and external engagement tools (Slido, Mentimeter).
- **Static Feedback:** Difficulty in getting quantitative real-time sentiment.

## 3. Proposed Solution
A "unified screen" experience where:
- Participants use their own devices (mobile/web) to view slides, participate, and react.
- Hosts manage everything from a single dashboard without tab-switching.
- Real-time analytics provide immediate insight into audience sentiment and knowledge.

---

## 4. User Roles & Tiers

| Role | Access Level | Responsibilities |
| :--- | :--- | :--- |
| **SuperAdmin** | Full System Access | Platform analytics, billing, user management, global stats, system health. |
| **Host** | Room Creator | Create/Edit rooms, upload documents, launch quizzes/polls, moderate chat. |
| **Co-Host** | Managerial Access | Assist Host: moderate chat, manage Q&A queue, monitor technical status. |
| **Participant** | Interaction Access | View slides, vote in polls, take quizzes, chat (anonymous/named), react. |

---

## 5. Functional Requirements

### 5.1 Document Sharing & Presentation
- **In-App Viewer:** Support for PPTX, PDF, and Google Docs.
- **Sync Mode:** Participants' screens follow the Host's slide transitions in real-time.
- **Offline Access:** Ability to download materials if the host permits.

### 5.2 Interactive Quizzes
- **Question Types:**
    - **MCQ:** Standard multiple choice with image/video support.
    - **Voice-based response:** Real-time speech-to-text to capture verbal answers (useful for language learning or quick fire rounds).
    - **Audio-input:** Participants listen to a snippet and identify the source/answer.
    - **Pattern Matching:** Drag-and-drop sequencing or connecting dots.
- **Gamification:**
    - **Live Leaderboard:** Top 10 displayed on Host's screen with "fastest finger first" bonuses.
    - **Streak Multipliers:** Consecutively correct answers increase point weighting.
- **Dynamic Feedback:** Immediate "Correct/Incorrect" haptic feedback and animations on the mobile device.

### 5.3 Live Polls
- **Visualization:**
    - **Dynamic Charts:** Smoothly animating Bar, Pie, and Donut charts.
    - **Word Cloud:** Real-time font-size scaling based on word frequency from open-ended questions.
    - **Heatmaps:** For image-based polls where users click on specific areas.
- **Advanced Options:** Timed polls, hidden results (until closed), and demographic filtering (e.g., "See results by Age group").

### 5.4 Real-time Chat & Engagement
- **General Chat:**
    - **Performance:** Throttled rendering for participants to prevent UI freezes at 1M users.
    - **Rich Media:** Support for stickers and GIFs from a curated library.
- **Spam Filtering:**
    - **AI Moderation:** Real-time sentiment analysis and toxicity detection.
    - **Rate Limiting:** Maximum 2 messages per second per user.
- **Anonymity:**
    - **Alias System:** Randomly assigned "Adjective + Animal" pairs. Permanent for the session.
- **Reactions:** Large-scale "Emoji Bursts" where thousands of floating icons populate the Host's screen simultaneously without lagging the UI.

### 5.5 Analytics & Data Visualization
- **Real-time Metrics:**
    - **Engagement Score:** A live index calculated from chat frequency, reaction count, and quiz participation.
    - **Retention Rate:** Tracking when users join and drop off during the event.
    - **Sentiment Analysis:** A live "Mood Meter" aggregate of chat and reactions.

### 5.5 Authentication & Access
- **SSO:** Google OAuth implementation.
- **Standard:** Email/Password with JWT-based session management.
- **Room Access:** Simple 6-digit PIN or QR Code for Participants (no login required for guest mode).

---

## 6. Technical Requirements & Architecture (Scale: 1M Users)

### 6.1 Scalability Strategy (1 Million Concurrent Users)
- **WebSocket Gateway:** Use a distributed gateway layer (e.g., **AWS API Gateway WebSockets** or a custom **Go/Rust** implementation) to handle millions of persistent TCP connections.
- **Global Pub/Sub:** Utilize **Redis Cluster** or **NATS JetStream** for millisecond-latency message broadcasting across server nodes.
- **Sharded Databases:** Implement database sharding for Chat and Analytics to prevent single-point bottlenecks.
- **Edge Computing:** Process reactions and chat filtering at the edge (Cloudflare Workers or Lambda@Edge) to reduce core server load.
- **CDN Strategy:** Use multi-layered caching for documents and static assets to ensure zero-latency slide transitions globally.

### 6.2 Frontend Architecture
- **Framework:** Next.js (React) for SEO and performance.
- **Real-time Rendering:** Optimized Virtual DOM updates for the chat component to prevent browser lag during high-frequency messaging.
- **Asset Delivery:** Global CDN (CloudFront/Cloudflare) for static assets and uploaded documents.

### 6.3 Data Management
- **Primary DB:** PostgreSQL with Read Replicas for structured data (Users, Rooms).
- **High-Velocity Data:** MongoDB or DynamoDB for chat history and reaction logs.
- **Caching:** Redis for session data, presence (who is online), and hot poll results.

---

## 7. Design & UX Guidelines

> [!IMPORTANT]
> The design must feel **Premium & Alive**. Avoid a "generic utility" look.

### 7.1 Themes & Styling
- **Light & Dark Mode:** Full system support with a persistent toggle.
    - **Dark Mode (Default):** Deep charcoal/purple backgrounds with glassmorphic cards and neon accents.
    - **Light Mode:** High-contrast crisp white/grey backgrounds with soft shadows and pastel-vibrant accents.
- **Micro-Animations:** Smooth transitions for slide changes, "growing" bars in polls, and floating reaction emojis.

### 7.2 Device Responsiveness
- **Host View (Laptop/Desktop):** Optimized for side-by-side display of questions, leaderboard, and chat moderation. Large font sizes for readability on project screens.
- **Participant View (Mobile):** Touch-first UI with large bottom-nav buttons for reactions and full-screen overlays for quiz results to minimize scrolling.
- **Typography:** Modern sans-serif (Inter or Montserrat) with high legibility.

---

## 8. Security & Compliance
- **Data Encryption:** TLS 1.3 for data in transit; AES-256 for data at rest.
- **Rate Limiting:** Protect APIs from DDoS and script-based spam.
- **Privacy:** GDPR/CCPA compliance for user data handling.

---

## 9. Success Metrics (KPIs)
1. **Concurrent User Peak:** Support for 1,000,000 simultaneous connections.
2. **Latency:** <200ms for reaction/chat propagation.
3. **Engagement Rate:** % of participants who interact with at least one poll/quiz.
4. **Reliability:** 99.9% uptime during live events.

---

## 10. Roadmap (Phase 1)
- **V1.0 (MVP):** Basic room creation, PDF sharing, simple MCQ polls, and basic chat with Google OAuth.
- **V1.1:** Anonymity mode, Reactions, and Spam filtering.
- **V1.2:** Advanced Quiz types (Audio/Voice) and Scalability testing for 100k users.
- **V2.0:** Full 1M user capability and SuperAdmin Analytics Dashboard.

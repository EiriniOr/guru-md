# Guru, M.D. — Technical Report
### AI in Healthcare Course Project

---

## 1. Project Overview

Guru, M.D. is an AI-powered health education platform designed for medical students. It provides personalized learning experiences by combining structured medical content with large language model (LLM) intelligence, real-time web search across authoritative medical sources, and adaptive features including quizzes, recommendations, and a synthesized news podcast. The platform is scoped to EU and Swedish medical practice, referencing guidelines from the ESC (European Society of Cardiology), EMA (European Medicines Agency), FASS (Swedish drug database), and Socialstyrelsen (Swedish National Board of Health and Welfare).

---

## 2. High-Level Feature Descriptions

### 2.1 AI Tutor
The AI Tutor is the core feature of the platform. Students can ask any medical question in natural language — from pharmacology mechanisms to clinical guidelines — and receive a structured, evidence-based response. Before generating an answer, the system queries multiple authoritative medical databases in real time and incorporates the retrieved content into the AI's response, with inline citations. This ensures answers reflect current knowledge rather than the AI's training data alone, which has a knowledge cutoff and may not reflect the latest guidelines.

The tutor is context-aware: when accessed from within a learning module, it knows the topic being studied and adapts its answers accordingly. Its responses follow EU and Swedish clinical conventions — for example, defaulting to ESC guidelines for cardiology, FASS for drug information, and SI units throughout.

### 2.2 Learning Paths
Learning paths are structured curricula organised by specialty (e.g. Cardiology, Pharmacology, Anatomy). Each path contains ordered modules with rich markdown content covering clinical theory, guidelines, and practical pearls. Students can track their progress through each path, with completion states persisted per user.

### 2.3 AI-Generated Quizzes
At the end of each module, students can take an AI-generated quiz. The AI reads the module content and generates five multiple-choice questions (MCQs) of varying difficulty, tailored to that specific material. Each question includes an explanation of the correct answer. A score of 60% or above automatically marks the module as completed. Quizzes are regenerated on each attempt, preventing memorisation of a fixed question bank.

### 2.4 Progress Tracking and Recommendations
The platform tracks every meaningful interaction — modules viewed, quizzes completed, messages sent — in an activity log. Based on this history and the student's completion states, a recommendation engine powered by the AI analyses gaps and patterns to suggest the next learning paths or modules. This creates a personalised study sequence without requiring manual configuration.

### 2.5 News Feed and Podcast
The news section fetches real-time medical and healthcare news from EU and Swedish sources using a web search API. Students can filter news by topic (e.g. ESC cardiology updates, EMA drug approvals, Swedish public health). The podcast feature takes the current news articles and generates a 2–3 minute spoken episode script using the AI, which is then read aloud using the browser's built-in speech synthesis engine. This simulates a medical podcast experience, enabling passive learning and staying current with the field.

---

## 3. Architecture and Technical Stack

### 3.1 Overview

```
Browser (Next.js App Router)
       │
       ├── Server Components  ─── fetch from Supabase (PostgreSQL)
       ├── Client Components  ─── interactive UI (quiz, chat, podcast)
       └── API Routes         ─── Claude API + Tavily API + Supabase
                                           │                   │
                                    Anthropic Claude     Web Search
                                    claude-sonnet-4-6    (medical sources)
```

### 3.2 Framework and Hosting

The application is built with **Next.js 16** using the App Router, which enables a hybrid rendering model: pages that require authentication and personalised data are server-rendered on demand (no client-side data fetching waterfall), while interactive components are client-rendered. The application is deployed on **Vercel**, which provides serverless edge infrastructure with automatic CI/CD from the GitHub repository.

### 3.3 Database and Authentication

**Supabase** provides both the relational database (PostgreSQL) and authentication. Row-Level Security (RLS) policies are defined at the database level, ensuring each user can only access their own data regardless of what the application layer requests. An automatic database trigger creates a user profile record the moment someone registers.

The main tables are:

| Table | Purpose |
|---|---|
| `profiles` | User metadata (name, university, year of study) |
| `learning_paths` | Seeded curriculum paths |
| `modules` | Individual modules within paths, with markdown content |
| `user_progress` | Per-user, per-module completion state |
| `chat_sessions` / `chat_messages` | Persisted tutor conversations with source metadata |
| `quiz_attempts` | Full quiz snapshots: questions, answers, score |
| `activity_log` | Append-only event log powering recommendations and activity feed |

### 3.4 AI Integration — Claude (Anthropic)

The platform uses **Claude claude-sonnet-4-6** as its reasoning engine across three distinct tasks:

**Tutor chat** — The model receives a system prompt that establishes its role as a medical educator with EU/Swedish clinical context. The conversation history (last 20 messages) is included to maintain context. Web search results are injected into the system prompt as a structured `<sources>` block, instructing the model to cite them inline. The response is streamed token-by-token to the client using Server-Sent Events (SSE), so the answer appears progressively without waiting for full generation.

**Quiz generation** — The model is given the module's markdown content and a strict JSON schema instruction. It generates five MCQs with options, the index of the correct answer, and an explanation. A parser validates the output before it reaches the client, catching any malformed responses.

**Recommendations** — The model receives a compact summary of the user's recent activity log and progress state (which modules are completed per path), along with the list of available paths. It returns a JSON array of 2–3 path or module recommendations with a one-sentence rationale for each.

**Podcast script** — The model is given news article content and instructed to write a 2–3 minute spoken monologue in the style of a medical education podcast, following EU/Swedish context. The output is plain prose suitable for text-to-speech.

### 3.5 Web Search Integration — Tavily

**Tavily** is a search API designed for AI augmentation (Retrieval-Augmented Generation, or RAG). Before every tutor response, the student's query is sent to Tavily with a domain allow-list of trusted medical sources:

- `pubmed.ncbi.nlm.nih.gov` — research abstracts
- `medlineplus.gov` — NLM patient and student reference
- `who.int` — WHO global health data
- `escardio.org` — ESC cardiology guidelines
- `fass.se` — Swedish drug monographs
- `janusinfo.se` — Stockholm clinical guidelines
- `sbu.se` — Swedish health technology assessments
- `ema.europa.eu` — EMA drug approval records
- `socialstyrelsen.se`, `folkhalsomyndigheten.se` — Swedish national health authorities

The top results (title, URL, content snippet) are returned within ~300ms and injected into Claude's context. This pattern — retrieve first, then generate — is called **RAG (Retrieval-Augmented Generation)** and is the standard approach to grounding AI responses in current, verifiable evidence rather than static training data.

### 3.6 Podcast Audio — Web Speech API

Rather than a third-party text-to-speech service, the podcast player uses the browser-native **Web Speech API** (`SpeechSynthesis`). This requires no additional API key, works across modern browsers, and supports voice selection. The AI generates the script; the browser reads it. This is a deliberate scope decision for the MVP — a production version would use a higher-quality neural TTS service (e.g. ElevenLabs or Google Cloud TTS).

### 3.7 Security Considerations

- All user data operations are gated by Supabase RLS — the database enforces ownership, not just application code
- API keys are never exposed to the browser; all AI and search calls happen in Next.js API routes (server-side)
- Session management is handled by Supabase Auth with cookies refreshed via the proxy (middleware) layer
- The Tavily domain allow-list limits search scope, reducing the risk of the AI citing low-quality or misleading sources

---

## 4. AI in Healthcare — Discussion

### 4.1 Role of AI in Medical Education

Traditional medical education relies on fixed curricula, textbooks, and periodic assessments. The challenge is scale: students progress at different rates, have different gaps, and clinical knowledge evolves faster than textbooks can be updated. AI addresses this in several ways:

- **Dynamic content retrieval** ensures answers reflect the current evidence base rather than a 2023 textbook edition
- **Adaptive quizzes** generate fresh questions tied to content the student just studied, replacing generic question banks
- **Personalised recommendations** identify knowledge gaps from behavioural data rather than requiring formal assessments

### 4.2 Limitations and Responsible Design

The tutor includes an explicit disclaimer that its output is educational and not a substitute for clinical judgment. Medical AI systems have well-documented failure modes: hallucination (generating plausible but false information), over-confidence in uncertain areas, and inability to account for local practice variation. The RAG architecture mitigates hallucination by anchoring responses to retrieved documents, but does not eliminate it.

The scope restriction to EU/Swedish guidelines is a deliberate design choice that reduces the risk of cross-jurisdictional confusion (e.g. recommending a drug not approved in Sweden, or citing American dosing conventions that differ from European practice).

### 4.3 Data and Privacy

The platform stores student learning data (progress, quiz scores, activity). In a production context this would require GDPR compliance — including a Data Processing Agreement (DPA) with Supabase and Anthropic, a privacy policy, and mechanisms for data deletion. For the course prototype, data is held in a Supabase project within the EU region.

### 4.4 Future Directions

The architecture supports several extensions described in the project scope but not yet implemented:

- **Doctor/nurse modes** — different system prompts calibrating answer complexity and clinical framing
- **Fine-tuned model** — ideally, the LLM would be fine-tuned on Swedish medical literature, FASS monographs, and SBU assessments to reduce reliance on general-purpose RAG
- **Outbreak surveillance** — integrating WHO and ECDC (European Centre for Disease Prevention and Control) feeds for real-time outbreak alerts
- **Perplexity Research API** — a research-grade search tool that could replace Tavily for deeper, multi-source synthesis on complex clinical questions

---

## 5. Entity and File Relationship Summary

The application is composed of four functional layers that interact as follows:

**Auth and data layer** — `proxy.ts` intercepts every request and validates the Supabase session cookie before any dashboard route is rendered. `lib/supabase/server.ts` and `lib/supabase/client.ts` provide server-side and browser-side database clients respectively. All tables enforce RLS using `auth.uid()`.

**Content layer** — Learning paths and modules are seeded static data in PostgreSQL. Server components in `app/dashboard/paths/` read this data at request time and render it with `ReactMarkdown`. `user_progress` is upserted on module view (to `in_progress`) and updated to `completed` either manually or on quiz pass.

**AI layer** — `app/api/chat/route.ts` is the tutor orchestrator: it calls `lib/tavily/search.ts` to retrieve sources, passes them to `lib/claude/prompts.ts` to construct the system prompt, then streams Claude's response via the Anthropic SDK. `app/api/quiz/generate/route.ts` sends module content to Claude and parses the JSON output through `lib/quiz/parser.ts`. `app/api/recommendations/route.ts` assembles a compact context from `activity_log` and `user_progress` and asks Claude for suggestions. `app/api/podcast/route.ts` fetches news via Tavily and generates a spoken script.

**UI layer** — `components/chat/ChatWindow.tsx` manages streaming state and renders `ChatMessage` components. `components/quiz/QuizRunner.tsx` implements the quiz state machine (idle → generating → answering → results). `components/dashboard/RecommendationPanel.tsx` fetches recommendations client-side on dashboard load. `components/news/NewsFeed.tsx` and `components/podcast/PodcastPlayer.tsx` handle news search and audio playback respectively.

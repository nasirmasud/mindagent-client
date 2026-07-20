# 🧠 MindAgent — AI-Powered Multi-Agent Productivity Platform

## Project Summary

**MindAgent** is a full-stack AI-powered productivity platform where users interact with multiple specialized AI Agents to generate content, analyze data, understand images, and chat with an intelligent assistant. Each agent is purpose-built for a specific task — Content Writer, Data Analyzer, Image Analyst, Chat Assistant — making this a multi-agent workflow platform, not a single-purpose chatbot. Built with Next.js, Express.js, MongoDB, and OpenRouter, it emphasizes agentic behavior (memory, reasoning, tool-calling), streaming responses, and a polished user experience.

---

## Architecture Overview

### Tech Stack

#### Frontend

- **Framework:** Next.js 15 (React 19) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3 + PostCSS
- **UI Components:** shadcn/ui (Radix UI primitives + CVA + tailwind-merge)
- **State/Data Fetching:** TanStack React Query v5
- **Charts:** Recharts
- **Forms:** Native React controlled inputs
- **Notifications:** Sonner (toast library)
- **Carousel:** Swiper
- **Theme:** next-themes (Dark/Light mode support)
- **Icons:** Lucide React
- **Markdown:** react-markdown

#### Backend

- **Runtime:** Node.js + Express.js + TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (7-day expiry) + Google OAuth
- **Password Hashing:** bcryptjs (12 rounds)
- **AI Provider:** OpenRouter (GPT-4o-mini for text, GPT-4o for vision)
- **File Parsing:** PapaParse (CSV), SheetJS/XLSX (Excel), native JSON
- **Validation:** Zod (request body validation)
- **File Upload:** Multer (memory storage, 5MB limit)
- **Rate Limiting:** express-rate-limit (10 AI req/min, 20 auth req/15min)
- **Security:** Helmet (HTTP headers), CORS

---

## Database Schema

### Collections

#### 1. **users**

- User accounts (email/password or Google OAuth)
- Fields: `name`, `email` (unique), `password` (hashed, optional for Google users), `authProvider` (email/google), `googleId`, `avatar`, `preferredProvider` (default: openrouter), `createdAt`

#### 2. **agents**

- AI agent catalog (seeded)
- Fields: `name`, `category`, `description`, `icon`, `rating`, `usageCount`

#### 3. **chatsessions**

- AI chat conversation history per user
- Fields: `userId` (ObjectId → User), `agentType`, `messages`: [{ `role` (user/assistant/system), `content`, `timestamp` }]

#### 4. **generatedcontents**

- AI-generated content history
- Fields: `userId` (ObjectId → User), `prompt`, `output`, `contentType`, `provider`, `createdAt`

#### 5. **imageanalyses**

- Image analysis history
- Fields: `userId` (ObjectId → User), `imageData` (base64), `imageName`, `prompt`, `analysis`, `tags` [{label, conf}], `dimensions` {width, height}, `palette` [string], `createdAt`

#### 6. **dataanalyses**

- Data analysis history
- Fields: `userId` (ObjectId → User), `fileName`, `fileType` (csv/xlsx/json), `originalRowCount`, `parsedPreview` [Mixed], `aiInsights` {summary, trends[], risks[], kpis[{label, value}]}, `provider`, `reportUrl`, `createdAt`

#### 7. **items**

- Uploaded data files with AI-generated insights
- Fields: `ownerId` (ObjectId → User), `title`, `shortDescription`, `fullDescription`, `sourceFileName`, `sourceFileType` (csv/xlsx/json), `rowCount`, `columns[]`, `parsedPreview` [Mixed], `insights` {summary, trends[], kpis[], risks[]}, `chartData` [{label, value}], `status` (processing/completed/failed), `createdAt`

---

## Project Structure

```
MindAgent/
├── client/                             # Next.js 15 frontend
│   ├── src/
│   │   ├── app/                        # Next.js App Router pages (16 routes)
│   │   │   ├── layout.tsx              # Root layout (ThemeProvider, QueryProvider, AuthProvider, Navbar, Footer)
│   │   │   ├── page.tsx                # Home page (9 sections)
│   │   │   ├── globals.css             # Global styles + Tailwind theme tokens
│   │   │   ├── not-found.tsx           # Custom 404 page
│   │   │   ├── login/page.tsx          # Login + demo login
│   │   │   ├── register/page.tsx       # User registration
│   │   │   ├── profile/page.tsx        # User profile with sidebar, stats, donut charts
│   │   │   ├── ai-chat/page.tsx        # Streaming AI chat assistant
│   │   │   ├── content-generator/page.tsx  # AI content generation
│   │   │   ├── image-analyzer/page.tsx # AI image analysis
│   │   │   ├── data-analyzer/page.tsx  # CSV/XLSX/JSON data analysis
│   │   │   ├── explore/page.tsx        # Agent/tool catalog
│   │   │   ├── pricing/page.tsx        # Pricing plans
│   │   │   ├── about/page.tsx          # About page
│   │   │   ├── contact/page.tsx        # Contact form
│   │   │   ├── blog/page.tsx           # Blog listing
│   │   │   └── items/                  # Data item routes
│   │   │       ├── add/page.tsx        # Upload & analyze file
│   │   │       ├── manage/page.tsx     # Manage user's items
│   │   │       └── [id]/page.tsx       # Item detail with charts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                     # Reusable UI primitives (11 components)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   └── textarea.tsx
│   │   │   ├── layout/                 # Layout components (10)
│   │   │   │   ├── navbar.tsx          # Sticky nav with auth-aware links, avatar dropdown, mobile sheet
│   │   │   │   ├── footer.tsx          # Site footer
│   │   │   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   │   │   ├── hero-swiper.tsx     # Hero carousel (Swiper)
│   │   │   │   ├── feature-strip.tsx   # Feature highlights
│   │   │   │   ├── agent-categories.tsx # Agent category grid
│   │   │   │   ├── how-it-works.tsx    # How it works section
│   │   │   │   ├── testimonials.tsx     # Testimonials carousel
│   │   │   │   ├── faq-section.tsx     # FAQ accordion
│   │   │   │   └── newsletter-section.tsx # Newsletter signup
│   │   │   ├── auth/
│   │   │   │   └── google-auth-button.tsx # Google OAuth login button
│   │   │   ├── shared/
│   │   │   │   ├── error-boundary.tsx  # React error boundary
│   │   │   │   ├── loading-skeleton.tsx # Page skeleton loaders
│   │   │   │   └── toaster.tsx         # Sonner toast provider
│   │   │   └── items/
│   │   │       └── manage/
│   │   │           └── item-actions.tsx # Delete/view actions for item rows
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # Auth context hook
│   │   │   ├── use-queries.ts          # TanStack Query hooks for data fetching
│   │   │   └── useCountUp.ts           # Animated number counter
│   │   │
│   │   ├── providers/
│   │   │   ├── auth-provider.tsx       # JWT auth context (login, logout, user state)
│   │   │   ├── query-provider.tsx      # TanStack Query client provider
│   │   │   └── theme-provider.tsx      # next-themes dark/light provider
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                  # Fetch wrapper (base URL, auth headers, error handling)
│   │   │   └── utils.ts               # cn() classname utility
│   │   │
│   │   └── types/
│   │       └── globals.d.ts            # Global TypeScript declarations
│   │
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── server/                             # Express.js backend
    ├── src/
    │   ├── server.ts                   # Entry point (connect DB, start server)
    │   ├── app.ts                      # Express app setup (middleware, routes, error handler)
    │   │
    │   ├── config/
    │   │   ├── env.ts                  # Environment variable loader
    │   │   └── db.ts                   # MongoDB connection
    │   │
    │   ├── models/                     # Mongoose schemas (7)
    │   │   ├── User.ts
    │   │   ├── Agent.ts
    │   │   ├── ChatSession.ts
    │   │   ├── GeneratedContent.ts
    │   │   ├── ImageAnalysis.ts
    │   │   ├── DataAnalysis.ts
    │   │   └── Item.ts
    │   │
    │   ├── routes/                     # Express route handlers (6)
    │   │   ├── auth.ts                 # Register, login, demo-login, Google OAuth, profile update, password change
    │   │   ├── ai.ts                   # Content generation, image analysis, chat (SSE streaming), sessions
    │   │   ├── items.ts                # File upload, CRUD, AI analysis, report export (XLSX)
    │   │   ├── agents.ts               # Agent catalog
    │   │   ├── recommendations.ts      # AI-powered agent recommendations
    │   │   └── contact.ts              # Contact form handler
    │   │
    │   ├── middleware/                  # Express middleware (4)
    │   │   ├── protect.ts              # JWT auth guard (Bearer token → user attach)
    │   │   ├── errorHandler.ts         # Global error handler
    │   │   ├── rateLimiter.ts          # Rate limiters (AI: 10/min, Auth: 20/15min)
    │   │   └── upload.ts              # Multer file upload (CSV/XLSX/JSON, 5MB max)
    │   │
    │   ├── services/
    │   │   ├── ai/
    │   │   │   ├── aiProvider.interface.ts  # AIProvider interface (generateText, streamChat, analyzeImage)
    │   │   │   ├── aiProviderFactory.ts     # Factory: returns OpenRouterProvider
    │   │   │   └── openrouterProvider.ts    # OpenRouter implementation (GPT-4o-mini, GPT-4o vision)
    │   │   └── data/
    │   │       └── fileParser.ts        # CSV/XLSX/JSON file parser (PapaParse + XLSX)
    │   │
    │   ├── validators/                 # Zod request validation schemas (3)
    │   │   ├── auth.ts                 # register, login, google, updateProfile, changePassword
    │   │   ├── ai.ts                   # generateContent, analyzeImage, chat
    │   │   └── contact.ts             # contact form
    │   │
    │   ├── utils/
    │   │   └── jwt.ts                  # signToken / verifyToken (JWT helpers)
    │   │
    │   └── seed.ts                     # Database seeder (demo user + 4 sample reports)
    │
    ├── package.json
    ├── tsconfig.json
    ├── nodemon.json
    └── .env.example
```

---

## Data Flow

### File Upload & AI Analysis Flow

```
User uploads CSV/XLSX/JSON file
  → Multer middleware (5MB limit, type validation)
  → File parser extracts rows, columns, row count
  → Build analysis prompt with data sample (first 5 rows)
  → OpenRouter API (GPT-4o-mini) generates structured JSON insights
  → Store parsed data + AI insights in MongoDB (Item collection)
  → Return item with summary, trends, KPIs, risks, chart data
```

### AI Chat Flow (Streaming)

```
User sends message
  → Create or load existing ChatSession
  → Add user message to session history
  → Send full history to OpenRouter (GPT-4o-mini) with streaming
  → Server-Sent Events (SSE) stream tokens to frontend
  → Parse AI response for follow-up suggestions (JSON array)
  → Save assistant message to session
  → Display streaming text + suggestion buttons
```

### AI Content Generation Flow

```
User enters topic, selects type/tone/length
  → Select prompt template (blog/social/product/docs)
  → Replace placeholders with user input
  → OpenRouter API call (GPT-4o-mini, max_tokens based on length)
  → Save to GeneratedContent collection
  → Return generated text to frontend
```

### Image Analysis Flow

```
User uploads image (base64)
  → Optional: user provides custom prompt
  → OpenRouter Vision API (GPT-4o) with image + prompt
  → Save analysis to ImageAnalysis collection
  → Display analysis text, tags, dimensions, palette
```

### Authentication Flow

```
Login/Register
  → Zod validation
  → bcrypt hash (register) or compare (login)
  → Sign JWT (7-day expiry)
  → Store token in localStorage
  → Attach Bearer token to all API requests
  → protect middleware verifies token on protected routes
```

### Google OAuth Flow

```
Google Sign-In button
  → Google One-Tap returns credential
  → Decode Google JWT → extract name, email, googleId, avatar
  → POST /api/auth/google (auto-creates user if new)
  → Receive MindAgent JWT + user data
  → Store in auth context
```

---

## API Endpoints

### Public Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/health` | Health check |
| GET | `/api/agents` | List all agents |
| GET | `/api/agents/:id` | Get agent by ID |
| GET | `/api/items` | Browse items (paginated, searchable, filterable) |
| GET | `/api/items/:id` | Get item detail + related items |
| POST | `/api/contact` | Submit contact form |

### Auth Endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/api/auth/register` | Create account (email/password) |
| POST | `/api/auth/login` | Login (email/password) |
| POST | `/api/auth/demo-login` | Auto-login as demo user |
| POST | `/api/auth/google` | Google OAuth login/register |

### Protected Endpoints (JWT Required)

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/me` | Update profile (name, avatar) |
| PUT | `/api/auth/password` | Change password (email accounts only) |
| POST | `/api/ai/generate-content` | Generate AI content (blog/social/product/docs) |
| POST | `/api/ai/analyze-image` | Analyze uploaded image |
| GET | `/api/ai/image-history` | List user's image analyses |
| DELETE | `/api/ai/image-history/:id` | Delete image analysis |
| POST | `/api/ai/chat` | Send chat message (SSE streaming response) |
| GET | `/api/ai/sessions` | List user's chat sessions |
| DELETE | `/api/ai/sessions/:id` | Delete chat session |
| GET | `/api/ai/history` | List user's generated content |
| DELETE | `/api/ai/history/:id` | Delete generated content |
| GET | `/api/items/my` | List user's uploaded items |
| POST | `/api/items` | Upload & analyze file (CSV/XLSX/JSON) |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/api/items/:id/report` | Download item as XLSX report |
| GET | `/api/recommendations` | AI-powered agent recommendations |

---

## Security Considerations

1. **Authentication:** JWT tokens with 7-day expiry, bcrypt password hashing (12 rounds)
2. **Protected Routes:** Express middleware (`protect`) verifies Bearer token on all protected endpoints
3. **Input Validation:** Zod schemas validate all request bodies (auth, AI, contact)
4. **Rate Limiting:** AI endpoints limited to 10 requests/minute; auth endpoints limited to 20 requests/15 minutes
5. **File Upload Security:** Multer restricts to CSV/XLSX/JSON only, 5MB max size, memory storage (no disk writes)
6. **HTTP Security:** Helmet middleware sets secure HTTP headers
7. **CORS:** Configured to allow only the client origin with credentials
8. **Password Protection:** Password field excluded from all default Mongoose queries via `select: false`
9. **Data Isolation:** All user-scoped queries filter by `userId` / `ownerId` to prevent cross-user data access
10. **Environment Variables:** All API keys and secrets stored in `.env` / `.env.local` (gitignored)

---

## User Roles & Permissions

| Feature | Visitor | User |
| :--- | :---: | :---: |
| Browse Home Page | ✅ | ✅ |
| Browse Agent Catalog | ✅ | ✅ |
| View Agent Details | ✅ | ✅ |
| View Public Items | ✅ | ✅ |
| Read Blog / About / Pricing | ✅ | ✅ |
| Submit Contact Form | ✅ | ✅ |
| Login / Register | ✅ | ✅ |
| AI Chat Assistant | ❌ | ✅ |
| AI Content Generation | ❌ | ✅ |
| AI Image Analysis | ❌ | ✅ |
| Upload & Analyze Data Files | ❌ | ✅ |
| View Item Detail + Charts | ❌ | ✅ |
| Download XLSX Reports | ❌ | ✅ |
| Manage Own Items | ❌ | ✅ |
| View Profile & Dashboard | ❌ | ✅ |
| Edit Profile / Change Password | ❌ | ✅ |
| Delete Own Account | ❌ | ✅ |
| Get AI Recommendations | ❌ | ✅ |

---

## Project Pages

| Route | Access | Description |
| :--- | :---: | :--- |
| `/` | Public | Home — Hero swiper, features, agent categories, how it works, testimonials, FAQ, newsletter |
| `/explore` | Public | Agent/tool catalog with search and filters |
| `/pricing` | Public | Pricing plans |
| `/about` | Public | About page |
| `/blog` | Public | Blog listing |
| `/contact` | Public | Contact form |
| `/login` | Public | Login + demo login |
| `/register` | Public | User registration |
| `/ai-chat` | Protected | Streaming AI chat assistant with session history |
| `/content-generator` | Protected | AI content generation (blog, social, product, docs) |
| `/image-analyzer` | Protected | Upload image → AI-powered analysis with tags |
| `/data-analyzer` | Protected | CSV/XLSX/JSON data analysis with AI insights |
| `/items/add` | Protected | Upload data file for AI analysis |
| `/items/manage` | Protected | Manage uploaded data items |
| `/items/[id]` | Public | Item detail with charts, insights, related items |
| `/profile` | Protected | User profile with sidebar, stats, donut charts, settings |

---

## Performance & Scalability

- **Server-Side Pagination:** Items endpoint supports page/limit/sort/search/filter for efficient data loading
- **Skeleton Loaders:** Loading states on all pages for improved perceived performance
- **Streaming Responses:** AI chat uses Server-Sent Events (SSE) for real-time token delivery
- **Memory Storage:** Multer uses memory storage (no disk I/O) for fast file processing
- **Database Indexing:** Unique indexes on email, compound indexes on userId + timestamps
- **Rate Limiting:** Prevents API abuse (10 AI req/min, 20 auth req/15min)
- **Code Splitting:** Next.js App Router enables automatic route-based code splitting
- **Responsive Design:** Mobile-first layout works across all device sizes
- **Dark Mode:** Built-in theme switching with next-themes
- **Request Validation:** Zod schemas validate inputs early, preventing unnecessary DB/API calls

---

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenRouter API key

### Client Setup

```bash
cd client
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID
npm run dev
```

### Server Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, OPENROUTER_API_KEY
npm run dev
```

### Seed Database (Optional)

```bash
cd server
npm run seed
```

Creates a demo user (`demo@mindagent.ai` / `demo123`) with 4 sample data analysis reports.

### Environment Variables

#### Client (`.env.local`)

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g. `http://localhost:5000/api`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |

#### Server (`.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `PORT` | No | Server port (default: 5000) |

---

## Future Enhancement Opportunities

- **Multi-Provider AI:** Add Groq, Gemini, Anthropic, or OpenAI as alternative providers via the AIProvider interface
- **RAG (Retrieval-Augmented Generation):** Vector search over user's uploaded documents for context-aware responses
- **Agent Tool Calling:** Enable AI agents to invoke external tools (web search, calculator, database queries)
- **Conversation Branching:** Allow users to branch chat conversations from any point
- **Collaborative Workspaces:** Share items and chat sessions with team members
- **Export Formats:** PDF, Markdown, and HTML report exports in addition to XLSX
- **Real-Time Notifications:** WebSocket-based alerts for completed analyses
- **Advanced Data Visualization:** Interactive charts with drill-down, filtering, and custom dashboard builder
- **User Analytics Dashboard:** Usage statistics, token consumption tracking, and productivity metrics
- **API Key Management:** Allow users to bring their own API keys for higher rate limits
- **Webhooks:** Notify external services when analyses complete
- **Mobile App:** Native iOS/Android apps for on-the-go AI assistance

# MindAgent Client

Next.js + shadCN UI frontend for the MindAgent AI platform.

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your env vars
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g. `http://localhost:5000/api`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home — 9 sections (hero, categories, features, how it works, testimonials, FAQ, newsletter) |
| `/explore` | Public | Agent listing with search, filters, pagination |
| `/tools/:id` | Public | Agent detail |
| `/pricing` | Public | Pricing plans |
| `/blog` | Public | Blog listing |
| `/about` | Public | About page |
| `/contact` | Public | Contact form |
| `/login` | Public | Login + demo login |
| `/register` | Public | Register |
| `/ai-chat` | Protected | Streaming AI chat |
| `/content-generator` | Protected | AI content generation |
| `/data-analyzer` | Protected | Upload & analyze CSV/XLSX/JSON |
| `/items/add` | Protected | Add a listing |
| `/items/manage` | Protected | Manage your listings |
| `/profile` | Protected | Edit profile |

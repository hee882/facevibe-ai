# FaceVibe AI

> AI-powered face analysis — get your charm score, find your celebrity look-alike, and share with friends.

Upload a photo, and our AI instantly analyzes your face to deliver a **charm score (0–100)**, your **top 3 celebrity look-alikes**, and a **face shape analysis**. No login required — just upload, discover, and share.

## Features

- **Charm Score** — AI calculates your attractiveness score based on facial golden ratio analysis
- **Celebrity Look-alike** — Find your top 3 celebrity matches with similarity percentages
- **Face Shape Analysis** — Detect your face shape (oval, round, heart, square, oblong) with personalized insights
- **Viral Sharing** — Beautiful OG image cards optimized for Twitter, Instagram, KakaoTalk
- **Zero Login** — Play instantly without signing up. No friction, just fun.
- **Privacy First** — Photos are never stored. Processed in memory and immediately discarded.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| AI | Azure Face API |
| Database | Cloudflare D1 (SQLite) |
| Hosting | Cloudflare Pages + Workers |
| OG Image | Satori |
| Ads | Google AdSense |

## Getting Started

### Prerequisites

- Node.js 20+
- Azure Face API key ([Get free key — 30K calls/month](https://azure.microsoft.com/en-us/products/ai-services/ai-vision))

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Azure Face API credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Cloudflare Deployment

```bash
# Preview locally with Cloudflare Workers
npm run preview

# Deploy to production
npm run deploy
```

## How It Works

```
Upload Photo → AI Analysis (Azure Face API) → Score + Match + Shape → Result Page → Share
```

1. User uploads a face photo (drag & drop or camera)
2. Image is sent to the server API route **in memory** (never saved to disk)
3. Azure Face API detects the face and returns 27 facial landmarks
4. Our scoring algorithm calculates the charm score based on golden ratio proportions
5. Face descriptor vectors are compared against a celebrity database for look-alike matching
6. Results are saved to D1 database with a unique shareable link
7. User sees animated results and can share via social media

## Privacy

- Photos are **never stored** on any server
- Images are processed in memory and immediately discarded after analysis
- Only text results (score, celebrity matches, face type) are saved
- This is an **entertainment service** — results are for fun, not medical or legal use

## License

MIT

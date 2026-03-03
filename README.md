# HoverExplain

![Version](https://img.shields.io/vscode-marketplace/v/luckyra8od.hoverexplain)
![Installs](https://img.shields.io/vscode-marketplace/i/luckyra8od.hoverexplain)
[![License](https://img.shields.io/github/license/lra8dev/hoverexplain?style=flat-square)](LICENSE)

> Instant code understanding, right under your cursor.

HoverExplain helps you understand unfamiliar or forgotten code without breaking focus.\
**Just hover**, or **select and hover**—and get a short, human-readable explanation of what the code actually does.

Powered by AI, optimized for speed, and designed for real-world codebases.

![summary-demo](./apps/extension/assets/hoverexplain-summary-demo.gif)

## 🤔 Why HoverExplain?

Modern codebases are complex.\
Even clean code needs context.

HoverExplain helps you:

- **Understand unfamiliar code** instantly when onboarding or exploring new libraries.
- **Refresh logic** you wrote weeks ago.
- **Stay in the flow** without opening documentation sites or ChatGPT tabs.

No context switching. No noise. Just clarity.

## ✨ Features

- **Context-Aware Hover Summaries**\
  Automatically detects whether you’re hovering a variable, function, or class and summarizes only the relevant scope.
- **Selection Summaries (New in v1.5.1!)**: Select a specific block of code and hover over it to get a targeted explanation.
- **Ultra-Fast Responses**\
  Powered by **Upstash Redis** caching. Previously seen code returns in `<50ms`.
- **Smart Debouncing**\
  Prevents unnecessary API calls while moving your cursor rapidly.
- **Secure Authentication**\
  Auth handled via **Clerk** with usage tracking and rate limiting.
- **Focus Mode Toggle**\
  Pause or resume HoverExplain anytime directly from the VS Code Status Bar.

## 🧠 How it works (short & simple)

1. You hover over a symbol (or a highlighted selection) in your code.
2. HoverExplain extracts only the relevant context.
3. AI generates a concise explanation.
4. Result is cached for future hovers.

## ✊ Supported Languages

- TypeScript
- JavaScript
- Java
- C / C++
- C#
- Go

## 🔒 Privacy & Security

Your code privacy matters.

- **Stateless Analysis**: Code is analyzed and immediately discarded.
- **Hashed Caching**: Only a SHA-256 hash is stored, never raw code.
- **Secure Storage**: Tokens are saved via VS Code `SecretStorage`.

## 🛠 Tech Stack

This project is built as a high-performance **pnpm monorepo**.

**Extension Client (`apps/extension`)**

- TypeScript
- VS Code API
- `esbuild` for rapid bundling

**Backend API (`apps/api`)**

- Node.js + Express
- Google Gemini 1.5 Flash
- Upstash Redis (Caching & Rate Limiting)
- Clerk Authentication

## 💻 Development

```bash
git clone https://github.com/lra8dev/hoverexplain.git
cd hoverexplain
pnpm install
pnpm dev
```

Create `.env` in `apps/api/` with required keys.

```env

# Node environment
NODE_ENV="development" # update to production in prod

# Server configuration
PORT=5000
SERVER_API_URL="http://localhost:5000" # deployment URL in prod

# Clerk Auth API Keys
CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
JWT_SECRET="22fc05001ba5d15a4b2f713939e069b4b244fe769c279a370639ea870839b532"

# Google Gemini API Key
GEMINI_API_KEY=""

# Rate Limiting Configuration
RATE_LIMIT_TOKENS=10
RATE_LIMIT_WINDOW="24 h"

# Database connection string
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

## 📄 License

Distributed under the [MIT License](LICENSE).

---

<div align="center"><b>Built with ❤️ for developers who value focus, speed, and clarity.</b></div>

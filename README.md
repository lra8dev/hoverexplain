# HoverExplain

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/luckyra8od.hoverexplain?style=flat-square&color=2563eb)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverexplain)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/luckyra8od.hoverexplain?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverexplain)

> Instant code understanding, right under your cursor.

HoverExplain helps you understand unfamiliar or forgotten code without breaking focus.\
Just hover — get a short, human-readable explanation of what the code actually does.

Powered by AI, optimized for speed, and designed for real-world codebases.

![summary-demo](./apps/extension/assets/hoverexplain-summary-demo.gif)

## 🤔 Why HoverExplain?

Modern codebases are complex.\
Even clean code needs context.

HoverExplain helps you:

- Understand unfamiliar code instantly
- Refresh logic you wrote weeks ago
- Explore new libraries faster
- Stay in flow without opening docs or ChatGPT

No context switching. No noise. Just clarity.

## ✨ Features

- **Context-Aware Hover Summaries**\
  Automatically detects whether you’re hovering a variable, function, or class and summarizes only the relevant scope.
- **Ultra-Fast Responses**\
  Powered by **Upstash Redis** caching. Previously seen code returns in `<50ms`.
- **Smart Debouncing**\
  Prevents unnecessary API calls while moving your cursor.
- **Secure Authentication**\
  Auth handled via **Clerk** with usage tracking and rate limiting.
- **Focus Mode Toggle**\
  Pause or resume HoverExplain anytime from the Status Bar.

## 🧠 How it works (short & simple)

1. You hover over a symbol in code
2. HoverExplain extracts only the relevant context
3. AI generates a concise explanation
4. Result is cached for future hovers

## ✊ Supported Languages

- TypeScript
- JavaScript
- Java
- C / C++
- C#
- Go\
  _More coming soon._

## 🔒 Privacy & Security

Your code privacy matters.

- **Stateless Analysis**: Code is analyzed and immediately discarded
- **Hashed Caching**: Only a SHA-256 hash is stored, never raw code
- **Secure Storage**: Tokens are saved via VS Code `SecretStorage`

## 🛠 Tech Stack

**Extension**

- TypeScript
- VS Code API
- esbuild

**Backend**

- Node.js + Express
- Google Gemini 1.5 Flash
- Upstash Redis
- Clerk Authentication

## 💻 Development

```bash
git clone https://github.com/lra8dev/hoverexplain.git
cd hoverexplain
pnpm install
pnpm dev
```

Create `.env` in `apps/api/` with required keys.

## 📄 License

[MIT License](LICENSE)

---

<div align="center"><b>Built with ❤️ for developers who value focus, speed, and clarity.</b></div>

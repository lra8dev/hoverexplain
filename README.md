# HoverDocs AI

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/luckyra8od.hoverdocs-ai?style=flat-square&color=2563eb)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverdocs-ai)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/luckyra8od.hoverdocs-ai?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverdocs-ai)

> Context-Aware AI Code Summaries for VS Code

**HoverDocs AI** is your intelligent coding companion that explains complex logic instantly.
Powered by Google Gemini 1.5 Flash and Upstash Redis, it delivers lightning-fast, context-aware summaries of classes, functions, and variables directly inside your VS Code tooltip.

---

## ✨ Key Features

- **Smart Context Extraction**: Intelligently detects if you are hovering a variable (single line) or a class (block scope) and extracts _only_ the relevant context to save tokens.
- **Instant Caching**: Powered by **Upstash Redis**. If you have hovered this code before, the result is returned in `<50ms`.
- **Secure Authentication**: Enterprise-grade security via **Clerk**. Your usage is securely tracked and rate-limited.
- **Smart Debouncing**: Prevents accidental API calls while you fly your mouse across the screen.
- **Battery Included**: Comes with a Status Bar toggle to pause the AI when you need deep focus.

## 🚀 Getting Started

### Installation

1. Install via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverdocs-ai).
2. Or, clone this repo and run locally ([see Development](#-development)).

### Setup

1. Once installed, click the **"Sign In"** button in the notification (or run `HoverDocs: Sign In` from the Command Palette).
2. Authenticate via your browser.
3. Hover over any code block to see the magic! ✨

## 🕹️ Commands

| Command                    | Description                                                   |
| :------------------------- | :------------------------------------------------------------ |
| `HoverDocs: Sign In`       | Authenticate with the HoverDocs server.                       |
| `HoverDocs: Sign Out`      | Remove your session token from VS Code Secure Storage.        |
| `HoverDocs: Toggle On/Off` | Pause or Resume the extension. (Also available in Status Bar) |

## ✊ Supported Languages

HoverDocs AI provides full context-aware code summaries for a growing set of popular programming languages:

`TypeScript`, `JavaScript`, `Java`, `C++`, `C#`, and `C`, and `GoLang`

_More languages coming soon!_

## 🛠️ Tech Stack

This project is a high-performance Monorepo built with:

**Extension Client:**

- **TypeScript** & **esbuild** (Bundling)
- **VS Code API** (SecretStorage, HoverProvider, UriHandler)

**Backend API:**

- **Node.js** & **Express**
- **Google Gemini 1.5 Flash** (AI Model)
- **Upstash Redis** (Serverless Caching & Rate Limiting)
- **Clerk** (Authentication)

## 🔒 Privacy & Security Policy

We take your code privacy seriously.

1. **Stateless Analysis**: Your code is sent to Gemini for analysis and immediately discarded.
2. **Hashed Caching**: We store a **SHA-256 hash** of the code block in Redis, not the code itself.
3. **Secure Tokens**: Auth tokens are stored in the OS Keychain via VS Code's `SecretStorage` API.

## 💻 Development

This project uses **pnpm workspaces**.

1. **Clone & Install**

   ```bash
   git clone https://github.com/lra8dev/hoverdocs-ai.git
   cd hoverdocs-ai
   pnpm install

   ```

2. Environment Variables: Create a `.env` file in `apps/api/`:

```typescript
NODE_ENV = "development";
SERVER_API_URL = "http://localhost:5000";
PORT = "5000";
JWT_SECRET = your_jwt_secret;
CLERK_PUBLISHABLE_KEY = your_key;
CLERK_SECRET_KEY = your_secret;
UPSTASH_REDIS_REST_URL = your_url;
UPSTASH_REDIS_REST_TOKEN = your_token;
GEMINI_API_KEY = your_gemini_key;
```

3. **Run Development Mode:**

```bash
   pnpm dev
```

4. **Launch Extension:** Open the project in VS Code, go to the **Run and Debug** tab, and select **"Run Extension"**.

## 📄 License

Distributed under the `MIT License`. See [LICENSE](LICENSE) for more information.

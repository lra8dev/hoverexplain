## Feature `release 2.0`

*Text extraction idea:*

If it's a built-in keyword, statement, namespace, module, or similar:
Here, we've to extract that single built-in thing with it's current line of code for "code" prop.

And "context" prop will get surrounding codes ~10 Loc above and below.

Eg., consider third and fourth image, where "Math" an intristic JavaScript object or "Math.max()" a Math method returns larger value similarly, "const", "function", class, "if", and on and on are built-in keywords and statements.

summaryRequest = {
    code: "that single built-in thing",
    context: "block of code if it's a statement like `if()`, `loop()`, `switch()`, etc. otherwise it's single line of code."
}

AI should explain that built-in thing (respecting language) with an example of it's context.

**Code:**
 const wordRange = document.getWordRangeAtPosition(position);
    const currentText = document.getText(wordRange);

    return {
      code: CodeExtractor.reservedWord(currentText),
      context: undefined,
    };
    
private static reservedWord(word: string): string | undefined {
  import { createScanner, ScriptTarget, SyntaxKind } from "typescript";
    const scanner = createScanner(ScriptTarget.Latest, true);
    scanner.setText(word);

    const kind = scanner.scan();

    if (kind >= SyntaxKind.FirstReservedWord && kind <= SyntaxKind.LastReservedWord) {
      return word;
    }

    return undefined;
  }

  TODO: improve CORS configuration

  TODO: update antfu-eslint to later version causing issues
  WIP: Release 1.0.1: update extension name to "ContextAI" and description:
  Context-Aware AI Code Summaries for VS Code
  TODO: Initially extension will be off
  TODO: fix rate limiter for cached summaries
  readme (extension):
  # HoverLens

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/luckyra8od.hoverlens?style=flat-square&color=2563eb)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverlens)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/luckyra8od.hoverlens?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverlens)

Context-Aware AI Code Summaries for VS Code

**HoverLens** is your intelligent coding companion that explains complex logic instantly.
Powered by Google Gemini 1.5 Flash and Upstash Redis, it delivers lightning-fast, context-aware summaries of classes, functions, and variables directly inside your VS Code tooltip.

![Demo](https://my-raw-github-url/summary-demo-with-a-class-and-function.gif)
_(Replace this line with a GIF of the extension in action!)_

---

## ✨ Key Features

- **Smart Context Extraction**: Intelligently detects if you are hovering a variable (single line) or a class (block scope) and extracts _only_ the relevant context to save tokens.
- **Instant Caching**: Powered by **Upstash Redis**. If you have hovered this code before, the result is returned in `<50ms`.
- **Secure Authentication**: Enterprise-grade security via **Clerk**. Your usage is securely tracked and rate-limited.
- **Smart Debouncing**: Prevents accidental API calls while you fly your mouse across the screen.
- **Battery Included**: Comes with a Status Bar toggle to pause the AI when you need deep focus.

## 🚀 Usage

1. **Install** the extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=luckyra8od.hoverlens).
2. Click the **"Sign In"** button in the notification (or run `HoverDocs: Sign In` from the Command Palette).
3. **Authenticate** via your browser.
4. **Hover** over any code block to see the magic! ✨

![summary-demo](https://github.com/lra8dev/hoverlens/blob/main/extension/assets/hoverlens-toggle-on-get-summary.gif)

****

## 🕹️ Commands

| Command                    | Description                                                   |
| :------------------------- | :------------------------------------------------------------ |
| `HoverDocs: Sign In`       | Authenticate with the HoverDocs server.                       |
| `HoverDocs: Sign Out`      | Remove your session token from VS Code Secure Storage.        |
| `HoverDocs: Toggle On/Off` | Pause or Resume the extension. (Also available in Status Bar) |

![Demo](https://my-raw-github-url/sign-out-and-toggle-on-off.gif)
_(Replace this line with a GIF of the extension in action!)_

**Sign in and get code summary**

![Demo](https://my-raw-github-url/sign-out-and-toggle-on-off.gif)
_(Replace this line with a GIF of the extension in action!)_

**Sign Out and Toggle on/off**

## ✊ Supported Languages

HoverLens provides full context-aware code summaries for a growing set of popular programming languages:

`TypeScript`, `JavaScript`, `Java`, `C++`, `C#`, and `C`, and `GoLang`

_More languages coming soon!_

## 🔒 Privacy & Security

We take your code privacy seriously.

1. **Stateless Analysis**: Your code is sent to Gemini for analysis and immediately discarded.
2. **Hashed Caching**: We store a **SHA-256 hash** of the code block in Redis, not the code itself.
3. **Secure Tokens**: Auth tokens are stored in the OS Keychain via VS Code's `SecretStorage` API.

## 📄 License

Distributed under the [MIT License](https://github.com/lra8dev/hoverlens/blob/main/LICENSE).

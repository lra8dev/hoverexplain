import type { Request, Response } from "express";

import { getAuth } from "@clerk/express";

import { config } from "@/config/env-variable";
import { ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { JwtService } from "@/services/jwt-service";

const REDIRECT_COOKIE = "hoverexplain_redirect_uri";

export class AuthController {
  public static login(req: Request, res: Response): void {
    const redirectUri = req.query.redirect_uri as string;

    if (!redirectUri) {
      throw new ApiError("Missing redirect_uri parameter", 400);
    }

    res.cookie(REDIRECT_COOKIE, redirectUri, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    const auth = getAuth(req);
    if (auth.userId && auth.sessionId) {
      res.redirect("/api/auth/callback");
      return;
    }

    res.send(AuthController.loginPage());
  }

  public static async callback(req: Request, res: Response): Promise<void> {
    try {
      const redirectUri = req.cookies?.[REDIRECT_COOKIE];

      if (!redirectUri) {
        res.status(400).send(AuthController.errorPage("Session expired. Please try logging in again."));
        return;
      }

      const auth = getAuth(req);

      if (!auth.userId || !auth.sessionId) {
        res.redirect(`/api/auth/login?redirect_uri=${encodeURIComponent(redirectUri)}`);
        return;
      }

      res.clearCookie(REDIRECT_COOKIE);

      const extensionToken = JwtService.sign({
        userId: auth.userId,
        sessionId: auth.sessionId,
      });

      const decodedUri = decodeURIComponent(redirectUri);
      const separator = decodedUri.includes("?") ? "&" : "?";
      const vscodeUri = `${decodedUri}${separator}token=${extensionToken}`;

      res.send(AuthController.successPage(vscodeUri));
    }
    catch (error) {
      logger.error(error, "Auth callback error");
      res.status(500).send(AuthController.errorPage("Authentication failed. Please try again."));
    }
  }

  public static logout(req: Request, res: Response): void {
    res.clearCookie(REDIRECT_COOKIE);
    res.send(AuthController.logoutPage());
  }

  private static loginPage(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HoverExplain - Sign In</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    .container {
      width: 100%;
      max-width: 440px;
    }
    #clerk-auth { 
      min-height: 400px; 
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #27272a;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error { color: #ef4444; padding: 1rem; }
  </style>
</head>
<body>
  <div class="container">
   <div id="clerk-auth">
      <div class="loading">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>
  </div>

  <script
    async
    crossorigin="anonymous"
    data-clerk-publishable-key="${config.CLERK_PUBLISHABLE_KEY}"
    src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
    onload="initClerk()"
    onerror="showError('Failed to load authentication service')"
  ></script>
  <script>
    function showError(msg) {
      document.getElementById('clerk-auth').innerHTML = '<p class="error">' + msg + '</p>';
    }

    async function initClerk() {
      try {
        await window.Clerk.load();

        if (window.Clerk.user) {
          document.getElementById('clerk-auth').innerHTML = 
            '<div class="loading"><div class="spinner"></div><span>Redirecting...</span></div>';
          window.location.href = '/api/auth/callback';
          return;
        }

        document.getElementById('clerk-auth').innerHTML = '';
        window.Clerk.mountSignIn(document.getElementById('clerk-auth'), {
          signInFallbackRedirectUrl: '/api/auth/callback',
          signUpFallbackRedirectUrl: '/api/auth/callback',
        });
      } catch (err) {
        showError('Authentication service error: ' + (err.message || 'Unknown error'));
      }
    }
  </script>
</body>
</html>`;
  }

  private static successPage(redirectUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HoverExplain - Success</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      background: #18181b;
      padding: 2.5rem;
      border-radius: 12px;
      border: 1px solid #27272a;
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #22c55e; margin: 0 0 1rem; }
    p { color: #a1a1aa; margin: 0 0 1.5rem; }
    .redirect-note { font-size: 0.875rem; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Authentication Successful</h1>
    <p>You can close this window and return to VS Code.</p>
    <p class="redirect-note">Redirecting automatically...</p>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = "${redirectUrl}";
    }, 1000);
  </script>
</body>
</html>`;
  }

  private static logoutPage(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HoverExplain - Signed Out</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      background: #18181b;
      padding: 2.5rem;
      border-radius: 12px;
      border: 1px solid #27272a;
      text-align: center;
      max-width: 400px;
    }
    h1 { margin: 0 0 1rem; }
    p { color: #a1a1aa; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Signed Out</h1>
    <p>You have been signed out. You can close this window.</p>
  </div>
  <script
    async
    crossorigin="anonymous"
    data-clerk-publishable-key="${config.CLERK_PUBLISHABLE_KEY}"
    src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
    onload="window.Clerk.load().then(() => window.Clerk.signOut({ redirectUrl: window.location.href }))"
  ></script>
</body>
</html>`;
  }

  private static errorPage(message: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HoverExplain - Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #09090b;
      color: #f4f4f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      background: #18181b;
      padding: 2.5rem;
      border-radius: 12px;
      border: 1px solid #27272a;
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #ef4444; margin: 0 0 1rem; }
    p { color: #a1a1aa; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Authentication Error</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
  }
}

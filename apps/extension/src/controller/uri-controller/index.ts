import type { Uri, UriHandler } from "vscode";

import type { AuthManager } from "../../services/auth-manager";

export class HoverExplainUriHandler implements UriHandler {
  private authManager: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager = authManager;
  }

  async handleUri(uri: Uri): Promise<void> {
    if (uri.path === "/auth") {
      const query = new URLSearchParams(uri.query);
      const token = query.get("token");
      await this.authManager.setToken(token);
    }
  }
}

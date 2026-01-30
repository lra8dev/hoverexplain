import type * as vscode from "vscode";

import { authTokenSchema } from "@hoverlens/validators";

import type { AuthManager } from "../../services/auth-manager";

import { showToast } from "../../utils/toast";

export class HoverLensUriHandler implements vscode.UriHandler {
  private authManager: AuthManager;

  constructor(authManager: AuthManager) {
    this.authManager = authManager;
  }

  handleUri(uri: vscode.Uri): void {
    if (uri.path === "/auth") {
      const query = new URLSearchParams(uri.query);
      const token = query.get("token");

      const { success, data } = authTokenSchema.safeParse({ token });

      if (success && data.token) {
        this.authManager.setToken(data.token);
      }
      else {
        showToast("Login failed (No token received).", { isError: true });
      }
    }
  }
}

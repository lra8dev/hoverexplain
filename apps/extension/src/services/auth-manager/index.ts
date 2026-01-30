import * as vscode from "vscode";

import { config } from "../../config";
import { showToast } from "../../utils/toast";

export class AuthManager {
  private static readonly SECRET_KEY = "hoverlens_auth_token";
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public async signIn() {
    const vscodeUri = `${vscode.env.uriScheme}://${config.X_PUBLISHER}.${config.X_IDENTIFIER}/auth`;
    const callbackUri = await vscode.env.asExternalUri(vscode.Uri.parse(vscodeUri));

    const serverUrl = `${config.SERVER_API_URL}/api/auth/login?redirect_uri=${encodeURIComponent(callbackUri.toString())}`;
    await vscode.env.openExternal(vscode.Uri.parse(serverUrl));
  }

  public async setToken(token: string) {
    await this.context.secrets.store(AuthManager.SECRET_KEY, token);
    showToast("Successfully logged in!");
  }

  public async getToken(): Promise<string | undefined> {
    return await this.context.secrets.get(AuthManager.SECRET_KEY);
  }

  public async signOut() {
    const token = await this.getToken();
    if (!token) {
      showToast("You are not signed in.", { isError: true });
      return;
    }

    await this.context.secrets.delete(AuthManager.SECRET_KEY);
    await vscode.env.openExternal(vscode.Uri.parse(`${config.SERVER_API_URL}/api/auth/logout`));
    showToast("Signed out.");
  }
}

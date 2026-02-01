import type { SecretStorage } from "vscode";

import { authTokenSchema } from "@hoverexplain/validators";
import { env, Uri } from "vscode";

import type { AuthSecret } from "../../types";

import { config } from "../../config";
import { Toast } from "../../utils/toast";

export class AuthManager {
  private static readonly SECRET_KEY = "hoverexplain_auth_token";
  private readonly secrets: SecretStorage;

  constructor(secrets: SecretStorage) {
    this.secrets = secrets;
  }

  public async signIn(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      return Toast.info("You are already signed in.");
    }

    const vscodeUri = `${env.uriScheme}://${config.X_PUBLISHER}.${config.X_IDENTIFIER}/auth`;
    const callbackUri = await env.asExternalUri(Uri.parse(vscodeUri));
    const encodedCallback = encodeURIComponent(callbackUri.toString());
    const serverUrl = `${config.SERVER_API_URL}/api/auth/login?redirect_uri=${encodedCallback}`;

    await env.openExternal(Uri.parse(serverUrl));
  }

  public async setToken(token: string | null): Promise<void> {
    const { success, data } = authTokenSchema.safeParse({ token });

    if (!success) {
      return Toast.error("Failed to authenticate. Invalid token received.");
    }

    const secret: AuthSecret = {
      token: data.token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    await this.secrets.store(AuthManager.SECRET_KEY, JSON.stringify(secret));
    Toast.info("Successfully logged in!");
  }

  public async getToken(): Promise<string | undefined> {
    const storedSecret = await this.secrets.get(AuthManager.SECRET_KEY);

    if (!storedSecret) {
      return undefined;
    }

    try {
      const secret: AuthSecret = JSON.parse(storedSecret);

      if (Date.now() > secret.expiresAt) {
        await this.deleteToken();
        return undefined;
      }

      return secret.token;
    }
    catch {
      await this.deleteToken();
      return undefined;
    }
  }

  public async signOut(): Promise<void> {
    const token = await this.getToken();
    if (!token) {
      return Toast.error("You are not signed in or your session has expired.");
    }

    await this.deleteToken();
    await env.openExternal(Uri.parse(`${config.SERVER_API_URL}/api/auth/logout`));
    Toast.info("Signed out.");
  }

  private async deleteToken(): Promise<void> {
    await this.secrets.delete(AuthManager.SECRET_KEY);
  }
}

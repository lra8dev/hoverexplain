import type { ExtensionContext, StatusBarItem } from "vscode";

import { commands, languages, StatusBarAlignment, window } from "vscode";

import { selector } from "./constants";
import { HoverLensProvider } from "./controller/hoverlens-provider";
import { HoverLensUriHandler } from "./controller/uri-controller";
import { ApiService } from "./services/api-service";
import { AuthManager } from "./services/auth-manager";
import { updateStatusBar } from "./utils/status-bar";

let statusBarItem: StatusBarItem;

export function activate(context: ExtensionContext) {
  const authManager = new AuthManager(context);
  const apiService = new ApiService(authManager);
  const hoverProvider = new HoverLensProvider(apiService);

  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  statusBarItem.command = "hoverlens.toggle";

  const toggleCommand = commands.registerCommand("hoverlens.toggle", () => {
    hoverProvider.isEnabled = !hoverProvider.isEnabled;
    updateStatusBar(hoverProvider.isEnabled, statusBarItem);
  });
  const signInCommand = commands.registerCommand("hoverlens.signin", () => authManager.signIn());
  const signOutCommand = commands.registerCommand("hoverlens.signout", () => authManager.signOut());

  context.subscriptions.push(
    statusBarItem,
    toggleCommand,
    signInCommand,
    signOutCommand,
    languages.registerHoverProvider(selector, hoverProvider),
    window.registerUriHandler(new HoverLensUriHandler(authManager)),
  );

  updateStatusBar(hoverProvider.isEnabled, statusBarItem);
}

export function deactivate() {}

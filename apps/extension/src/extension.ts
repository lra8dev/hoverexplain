import type { ExtensionContext, StatusBarItem } from "vscode";

import { commands, languages, StatusBarAlignment, window } from "vscode";

import { selector } from "./constants";
import { HoverDocsProvider } from "./controller/hoverdocs-provider";
import { HoverDocsUriHandler } from "./controller/uri-controller";
import { ApiService } from "./services/api-service";
import { AuthManager } from "./services/auth-manager";
import { updateStatusBar } from "./utils/status-bar";

let statusBarItem: StatusBarItem;

export function activate(context: ExtensionContext) {
  const authManager = new AuthManager(context);
  const apiService = new ApiService(authManager);
  const hoverProvider = new HoverDocsProvider(apiService);

  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  statusBarItem.command = "hoverdocs.toggle";

  const toggleCommand = commands.registerCommand("hoverdocs.toggle", () => {
    hoverProvider.isEnabled = !hoverProvider.isEnabled;
    updateStatusBar(hoverProvider.isEnabled, statusBarItem);
  });
  const signInCommand = commands.registerCommand("hoverdocs.signin", () => authManager.signIn());
  const signOutCommand = commands.registerCommand("hoverdocs.signout", () => authManager.signOut());

  context.subscriptions.push(
    statusBarItem,
    toggleCommand,
    signInCommand,
    signOutCommand,
    languages.registerHoverProvider(selector, hoverProvider),
    window.registerUriHandler(new HoverDocsUriHandler(authManager)),
  );

  updateStatusBar(hoverProvider.isEnabled, statusBarItem);
}

export function deactivate() {}

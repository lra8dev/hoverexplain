import type { ExtensionContext, StatusBarItem } from "vscode";

import { commands, languages, StatusBarAlignment, window } from "vscode";

import { selector } from "./constants";
import { HoverExplainProvider } from "./controller/hoverexplain-provider";
import { HoverExplainUriHandler } from "./controller/uri-controller";
import { ApiService } from "./services/api-service";
import { AuthManager } from "./services/auth-manager";
import { updateStatusBar } from "./utils/status-bar";

let statusBarItem: StatusBarItem;

export function activate(context: ExtensionContext) {
  const authManager = new AuthManager(context.secrets);
  const apiService = new ApiService(authManager);
  const hoverProvider = new HoverExplainProvider(apiService);

  statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  statusBarItem.command = "hoverexplain.toggle";

  const toggleCommand = commands.registerCommand("hoverexplain.toggle", () => {
    hoverProvider.isEnabled = !hoverProvider.isEnabled;
    updateStatusBar(hoverProvider.isEnabled, statusBarItem);
  });
  const signInCommand = commands.registerCommand("hoverexplain.signin", () => authManager.signIn());
  const signOutCommand = commands.registerCommand("hoverexplain.signout", () => authManager.signOut());

  context.subscriptions.push(
    statusBarItem,
    toggleCommand,
    signInCommand,
    signOutCommand,
    languages.registerHoverProvider(selector, hoverProvider),
    window.registerUriHandler(new HoverExplainUriHandler(authManager)),
  );

  updateStatusBar(hoverProvider.isEnabled, statusBarItem, false);
}

export function deactivate() {}

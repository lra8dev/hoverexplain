import type { StatusBarItem } from "vscode";

import { ThemeColor } from "vscode";

import { showToast } from "../toast";

export function updateStatusBar(isEnabled: boolean, statusBarItem: StatusBarItem) {
  if (isEnabled) {
    statusBarItem.text = "$(zap) HoverLens";
    statusBarItem.tooltip = "Click to Pause AI Summaries";
    statusBarItem.backgroundColor = undefined;
    showToast("HoverLens is now Active!");
  }
  else {
    statusBarItem.text = "$(circle-slash) HoverLens";
    statusBarItem.tooltip = "Click to Activate AI Summaries";
    statusBarItem.backgroundColor = new ThemeColor("statusBarItem.warningBackground");
    showToast("HoverLens is now Paused.");
  }
  statusBarItem.show();
}

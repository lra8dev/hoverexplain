import type { StatusBarItem } from "vscode";

import { ThemeColor } from "vscode";

import { showToast } from "../toast";

export function updateStatusBar(isEnabled: boolean, statusBarItem: StatusBarItem) {
  if (isEnabled) {
    statusBarItem.text = "$(code) HoverExplain";
    statusBarItem.tooltip = "Click to Pause AI Summaries";
    statusBarItem.backgroundColor = undefined;
    showToast("HoverExplain is now Active!");
  }
  else {
    statusBarItem.text = "$(circle-slash) HoverExplain";
    statusBarItem.tooltip = "Click to Activate AI Summaries";
    statusBarItem.backgroundColor = new ThemeColor("statusBarItem.warningBackground");
    showToast("HoverExplain is now Paused.");
  }
  statusBarItem.show();
}

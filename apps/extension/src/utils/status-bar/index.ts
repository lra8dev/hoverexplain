import type { StatusBarItem } from "vscode";

import { ThemeColor } from "vscode";

import { Toast } from "../toast";

export function updateStatusBar(isEnabled: boolean, statusBarItem: StatusBarItem, notify = true) {
  if (isEnabled) {
    statusBarItem.text = "$(code) HoverExplain";
    statusBarItem.tooltip = "Click to Pause AI Summaries";
    statusBarItem.backgroundColor = undefined;
    if (notify)
      Toast.info("HoverExplain is now Active!");
  }
  else {
    statusBarItem.text = "$(circle-slash) HoverExplain";
    statusBarItem.tooltip = "Click to Activate AI Summaries";
    statusBarItem.backgroundColor = new ThemeColor("statusBarItem.warningBackground");
    if (notify)
      Toast.warn("HoverExplain is now Paused.");
  }
  statusBarItem.show();
}

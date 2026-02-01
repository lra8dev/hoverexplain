import { window as vscWindow } from "vscode";

export class Toast {
  public static info(message: string): void {
    vscWindow.showInformationMessage(`HoverExplain: ${message}`);
  }

  public static warn(message: string): void {
    vscWindow.showWarningMessage(`HoverExplain: ${message}`);
  }

  public static error(message: string): void {
    vscWindow.showErrorMessage(`HoverExplain: ${message}`);
  }
}

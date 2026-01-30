import { window as vscWindow } from "vscode";

export function showToast(message: string, options?: { isError: boolean }): void {
  if (options?.isError) {
    vscWindow.showErrorMessage(`HoverLens: ${message}`);
  }
  else {
    vscWindow.showInformationMessage(`HoverLens: ${message}`);
  }
}

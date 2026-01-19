import { window as vscWindow } from "vscode";

export function showToast(message: string, options?: { isError: boolean }): void {
  if (options?.isError) {
    vscWindow.showErrorMessage(`HoverDocs AI: ${message}`);
  }
  else {
    vscWindow.showInformationMessage(`HoverDocs AI: ${message}`);
  }
}

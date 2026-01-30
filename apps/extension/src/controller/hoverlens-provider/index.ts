import type { SummaryResponse } from "@hoverlens/validators";
import type { CancellationToken, HoverProvider, Position, TextDocument } from "vscode";

import { Hover, MarkdownString } from "vscode";

import type { ApiService } from "../../services/api-service";

import { CodeExtractor } from "../../utils/code-extractor";
import { getLineText } from "../../utils/document-linetext";

export class HoverLensProvider implements HoverProvider {
  private apiService: ApiService;
  private static readonly DEBOUNCE_MS = 600;
  public isEnabled: boolean = true;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
  ): Promise<Hover | null> {
    if (!this.isEnabled) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    const lineText = getLineText(document, position.line);

    if (!CodeExtractor.isValidCodeLine(lineText) || document.getText(range).length < 2) {
      return null;
    }

    await new Promise(resolve => setTimeout(resolve, HoverLensProvider.DEBOUNCE_MS));

    if (token.isCancellationRequested) {
      return null;
    }

    const { code, context } = CodeExtractor.extract(document, position.line);

    const summaryData = await this.apiService.getSummary(code, context, document.languageId);

    const markdown = HoverLensProvider.getMarkdownSummary(summaryData);

    return new Hover(markdown, range);
  }

  private static getMarkdownSummary(data: SummaryResponse | null): MarkdownString {
    const markdown = new MarkdownString();

    if (!data) {
      markdown.appendMarkdown("**HoverLens:** [Sign in](command:hoverlens.signin) to view summary.");
      return markdown;
    }

    markdown.isTrusted = true;
    markdown.supportHtml = true;

    markdown.appendMarkdown("### HoverLens\n\n");
    markdown.appendMarkdown(`${data.summary}\n\n`);
    markdown.appendMarkdown(`---\n`);
    return markdown;
  }
}

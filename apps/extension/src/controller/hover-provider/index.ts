import type { SummaryResponse } from "@hoverexplain/validators";
import type { CancellationToken, HoverProvider, Position, TextDocument } from "vscode";

import { Hover, MarkdownString, Range, window } from "vscode";

import type { ApiService } from "../../services/api-service";

import { CodeExtractor } from "../../utils/code-extractor";
import { getLineText } from "../../utils/document-linetext";

export class HoverExplainProvider implements HoverProvider {
  private apiService: ApiService;
  private static readonly DEBOUNCE_MS = 600;
  public isEnabled: boolean = false;

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

    const activeEditor = window.activeTextEditor;
    let codeToAnalyze: string | undefined;
    let contextData: string | undefined;
    let hoverRange: Range | undefined;

    if (activeEditor) {
      const selection = activeEditor.selection;

      if (selection && !selection.isEmpty && selection.contains(position)) {
        const validLines: string[] = [];

        for (let i = selection.start.line; i <= selection.end.line; i++) {
          const lineText = document.lineAt(i).text;

          if (CodeExtractor.isValidCodeLine(lineText)) {
            validLines.push(lineText.trim());

            if (validLines.length >= 50) {
              break;
            }
          }
        }

        if (validLines.length > 0) {
          codeToAnalyze = validLines.join("\n");
          hoverRange = selection;

          const start = CodeExtractor.findPreviousLineAtValidCount(document, selection.start.line - 1, 0);
          const end = CodeExtractor.findNextLineAtValidCount(document, selection.end.line + 1, document.lineCount - 1);

          const contextRange = new Range(start, 0, end, getLineText(document, end).length);
          contextData = document.getText(contextRange);
        }
      }
    }

    if (!codeToAnalyze) {
      const lineText = getLineText(document, position.line);
      const range = document.getWordRangeAtPosition(position);

      if (!range) {
        return null;
      }

      hoverRange = range;

      if (!CodeExtractor.isValidCodeLine(lineText) || document.getText(range).length < 2) {
        return null;
      }

      const { code, context } = CodeExtractor.extract(document, position.line);
      codeToAnalyze = code;
      contextData = context;
    }

    await new Promise(resolve => setTimeout(resolve, HoverExplainProvider.DEBOUNCE_MS));

    if (token.isCancellationRequested) {
      return null;
    }

    const summaryData = await this.apiService.getSummary(codeToAnalyze, contextData, document.languageId);

    const markdown = HoverExplainProvider.getMarkdownSummary(summaryData);

    return new Hover(markdown, hoverRange);
  }

  private static getMarkdownSummary(data: SummaryResponse | null): MarkdownString {
    const markdown = new MarkdownString();

    if (!data) {
      markdown.appendMarkdown("**HoverExplain:** [Sign in](command:hoverexplain.signin) to view summary.");
      return markdown;
    }

    markdown.isTrusted = true;
    markdown.supportHtml = true;

    markdown.appendMarkdown("### HoverExplain\n\n");
    markdown.appendMarkdown(`${data.summary}\n\n`);
    markdown.appendMarkdown(`---\n`);
    return markdown;
  }
}

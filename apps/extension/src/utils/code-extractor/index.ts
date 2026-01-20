import type { TextDocument } from "vscode";

import { Range } from "vscode";

import type { ExtractionResult } from "../../types";

import { blockDetectRegx, Symbol } from "../../constants";
import { getLineText } from "../document-linetext";

export class CodeExtractor {
  private static readonly BLOCK_LIMIT = 50;
  private static readonly CONTEXT_PADDING = 10;

  public static extract(document: TextDocument, position: number): ExtractionResult {
    const lineText = getLineText(document, position);

    if (blockDetectRegx.test(lineText) || lineText.endsWith(Symbol.OpenBrace)) {
      return this.handleBlockExtraction(document, position);
    }

    return this.handleLineExtraction(document, position);
  }

  private static handleBlockExtraction(document: TextDocument, startLineIndex: number): ExtractionResult {
    const endLineIndex = this.findMatchingClosingBracket(document, startLineIndex);
    const validLineCount = this.countValidLines(document, startLineIndex, endLineIndex);

    if (validLineCount <= this.BLOCK_LIMIT) {
      const range = new Range(startLineIndex, 0, endLineIndex, getLineText(document, endLineIndex).length);
      return {
        code: this.cleanCode(document.getText(range)),
        context: undefined,
      };
    }

    const truncatedEnd = this.findLineAtValidCount(
      document,
      startLineIndex,
      this.BLOCK_LIMIT,
      endLineIndex,
    );

    const codeRange = new Range(
      startLineIndex,
      0,
      truncatedEnd,
      getLineText(document, truncatedEnd).length,
    );

    const contextStart = this.findLineAtValidCountBackward(
      document,
      startLineIndex - 1,
      this.CONTEXT_PADDING,
      0,
    );
    const contextEnd = this.findLineAtValidCount(
      document,
      endLineIndex + 1,
      this.CONTEXT_PADDING,
      document.lineCount - 1,
    );

    const prevContext = startLineIndex > 0
      ? document.getText(new Range(
          contextStart,
          0,
          startLineIndex - 1,
          getLineText(document, startLineIndex - 1).length,
        ))
      : "";
    const nextContext = endLineIndex < document.lineCount - 1
      ? document.getText(new Range(
          endLineIndex + 1,
          0,
          contextEnd,
          getLineText(document, contextEnd).length,
        ))
      : "";

    return {
      code: this.cleanCode(document.getText(codeRange)),
      context: this.cleanCode(`${prevContext}\n${nextContext}`),
    };
  }

  private static handleLineExtraction(document: TextDocument, lineIndex: number): ExtractionResult {
    const start = this.findLineAtValidCountBackward(
      document,
      lineIndex - 1,
      this.CONTEXT_PADDING,
      0,
    );
    const end = this.findLineAtValidCount(
      document,
      lineIndex + 1,
      this.CONTEXT_PADDING,
      document.lineCount - 1,
    );

    const contextRange = new Range(start, 0, end, getLineText(document, end).length);

    return {
      code: getLineText(document, lineIndex).trim(),
      context: this.cleanCode(document.getText(contextRange)),
    };
  }

  private static findMatchingClosingBracket(document: TextDocument, startLine: number): number {
    let openBrackets = 0;
    let foundStart = false;

    const scanLimit = Math.min(document.lineCount, startLine + 200);

    for (let i = startLine; i < scanLimit; i++) {
      const line = getLineText(document, i);

      for (const char of line) {
        if (char === Symbol.OpenBrace) {
          openBrackets++;
          foundStart = true;
        }
        else if (char === Symbol.CloseBrace) {
          openBrackets--;
        }
      }

      if (foundStart && openBrackets === 0) {
        return i + 1;
      }
    }

    return scanLimit - 1;
  }

  public static isValidCodeLine(line: string): boolean {
    if (line.length === 0) {
      return false;
    };
    if (line.startsWith(Symbol.DoubleForwSlash)) {
      return false;
    };
    if (line.startsWith(Symbol.ForwSlashAster) || line.startsWith(Symbol.Asterisk)) {
      return false;
    };
    return true;
  }

  private static countValidLines(document: TextDocument, startLine: number, endLine: number): number {
    let count = 0;
    for (let i = startLine; i <= endLine; i++) {
      if (this.isValidCodeLine(getLineText(document, i))) {
        count++;
      }
    }
    return count;
  }

  private static findLineAtValidCount(
    document: TextDocument,
    startLine: number,
    limit: number,
    maxLine: number,
  ): number {
    let validCount = 0;
    for (let i = startLine; i <= maxLine; i++) {
      if (this.isValidCodeLine(getLineText(document, i))) {
        validCount++;
      }
      if (validCount >= limit) {
        return i;
      }
    }
    return maxLine;
  }

  private static findLineAtValidCountBackward(
    document: TextDocument,
    startLine: number,
    limit: number,
    minLine: number,
  ): number {
    let validCount = 0;
    for (let i = startLine; i >= minLine; i--) {
      if (this.isValidCodeLine(getLineText(document, i))) {
        validCount++;
      }
      if (validCount >= limit) {
        return i;
      }
    }
    return minLine;
  }

  private static cleanCode(text: string): string {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join("\n");
  }
}

export enum SupportedLanguages {
  TypeScript = "typescript",
  JavaScript = "javascript",
  CSharp = "csharp",
  Java = "java",
  Cpp = "cpp",
  Go = "go",
  C = "c",
}

export const selector = Object.values(SupportedLanguages).map(lang => (
  { scheme: "file", language: lang }
));

// Regex to detect function or method block starters
export const blockDetectRegx = /\([^)]*\)\s*(?:\{|=>\s*\{)/;

export enum Symbol {
  OpenBrace = "{",
  CloseBrace = "}",
  OpenSquare = "[",
  CloseSquare = "]",
  ArrowFun = "=>",
  Asterisk = "*",
  ForwSlashAster = "/*",
  AsterForwSlash = "*/",
  DoubleForwSlash = "//",
}

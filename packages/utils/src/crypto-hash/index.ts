import { createHash } from "node:crypto";

export function generateCodeHash(code: string): string {
  const normalized = code.trim().replace(/\s+/g, " ");
  return createHash("sha256").update(normalized).digest("hex");
}

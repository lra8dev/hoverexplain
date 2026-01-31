import type { SummaryRequest } from "@hoverexplain/validators";

export function AiPrompt(data: SummaryRequest): string {
  return `
  Analyze the following ${data.languageId} code snippet. 
  
  **CODE TO ANALYZE:**
  \`\`\`${data.languageId}
  ${data.code}
  \`\`\`

  **SURROUNDING CONTEXT (for reference only):**
  \`\`\`${data.languageId}
  ${data.context ?? "No context provided."}
  \`\`\`

  **TASK:**
  1. Identify if this is a Function, Class, Variable, or API call.
  2. Explain *what* it does and *why* it is useful.
  3. If it uses a specific design pattern (e.g., Singleton, Observer), mention it.
  4. **Icon Selection:** Choose one appropriate emoji for the header:
     - ⚡ (Performance/Optimization)
     - 🔒 (Auth/Security)
     - 📡 (API/Network)
     - 🛠️ (Utility/Helper)
     - 📦 (Data Structure/Class)
     - 🎨 (UI/Component)

  **OUTPUT FORMAT (follow EXACTLY - use <br> for line breaks, no blank lines):**
  \`\`\`
  *<Icon> <Concept Name>*<br>
  **Summary:** <description><br>
  **Complexity:** <O(n)> | **Type:** <Pattern>
  \`\`\`

  Return ONLY valid Markdown. Use <br> tags at end of lines for compact line breaks.
  `;
}

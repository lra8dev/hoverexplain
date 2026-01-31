import "dotenv/config";
import type { EnvConfig } from "@hoverexplain/validators";

import { envSchema } from "@hoverexplain/validators";

function validateEnv(): EnvConfig {
  // eslint-disable-next-line node/no-process-env -- Centralized env access point
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missingVars = parsed.error.issues
      .map(issue => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n  ");

    throw new Error(`Environment validation failed:\n  ${missingVars}`);
  }

  return parsed.data;
}

export const config = validateEnv();

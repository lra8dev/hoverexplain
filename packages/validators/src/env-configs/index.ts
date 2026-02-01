import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SERVER_API_URL: z.url("Server API URL must be a valid URL"),
  PORT: z.preprocess(val => Number(val), z.number().int().positive()),
  CLERK_PUBLISHABLE_KEY: z.string().refine(val => val.length > 0, {
    message: "Clerk Publishable Key is required",
  }),
  CLERK_SECRET_KEY: z.string().refine(val => val.length > 0, {
    message: "Clerk Secret Key is required",
  }),
  JWT_SECRET: z.string().min(32, {
    message: "JWT Secret must be at least 32 characters long",
  }),
  GEMINI_API_KEY: z.string().refine(val => val.length > 0, {
    message: "Gemini API key is required",
  }),
  RATE_LIMIT_TOKENS: z.preprocess(val => Number(val), z.number().int().positive()),
  RATE_LIMIT_WINDOW: z.string().refine(val => val.trim().length > 0, {
    message: "Rate limit duration is required",
  }),
  UPSTASH_REDIS_REST_URL: z.string().refine(val => val.length > 0, {
    message: "Upstash Redis REST URL is required",
  }),
  UPSTASH_REDIS_REST_TOKEN: z.string().refine(val => val.length > 0, {
    message: "Upstash Redis REST Token is required",
  }),
});

export type EnvConfig = z.infer<typeof envSchema>;

import { config } from "@hoverdocs/utils";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

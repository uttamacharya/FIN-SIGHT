import { redis } from "../../config/redis.js";
import crypto from "crypto";

/* helper: hash params */
const hashParams = (params = {}) => {
  return crypto
    .createHash("md5")
    .update(JSON.stringify(params))
    .digest("hex");
};

/* generic cache wrapper */
export const withAnalysisCache = async ({
  keyBase,
  params = {},
  ttl = 300,
  fetcher
}) => {
  const hash = hashParams(params);
  const cacheKey = `${keyBase}:${hash}`;

  // try cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // fetch from DB
  const data = await fetcher();

  // save to redis (ioredis way)
  await redis.set(
    cacheKey,
    JSON.stringify(data),
    "EX",
    ttl
  );

  return data;
};

/* cache invalidation */
export const invalidateAnalysisCache = async ({
  userId,
  uploadId
}) => {
  const pattern = `analysis:${userId}:${uploadId}:*`;

  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100
    );

    if (keys.length) {
      await redis.del(keys);
    }

    cursor = nextCursor;
  } while (cursor !== "0");
};

import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const isValidRedisUrl = (url) => {
	return url && !url.includes("your_redis_url") && (url.startsWith("redis://") || url.startsWith("rediss://"));
};

let redisClient;

if (isValidRedisUrl(process.env.UPSTASH_REDIS_URL)) {
	redisClient = new Redis(process.env.UPSTASH_REDIS_URL);
	redisClient.on("error", (err) => console.warn("Redis error:", err.message));
} else {
	console.log("No valid UPSTASH_REDIS_URL provided. Using in-memory fallback cache.");
	const memoryStore = new Map();
	redisClient = {
		async get(key) {
			const item = memoryStore.get(key);
			if (!item) return null;
			if (item.expiry && Date.now() > item.expiry) {
				memoryStore.delete(key);
				return null;
			}
			return item.value;
		},
		async set(key, value, mode, duration) {
			let expiry = null;
			if (mode === "EX" && duration) {
				expiry = Date.now() + duration * 1000;
			}
			memoryStore.set(key, { value: String(value), expiry });
			return "OK";
		},
		async del(key) {
			memoryStore.delete(key);
			return 1;
		},
	};
}

export const redis = redisClient;

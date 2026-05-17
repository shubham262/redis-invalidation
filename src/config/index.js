import { Redis } from "@upstash/redis";
const redis = new Redis({
	url: process.env.REDIS_END_POINT,
	token: process.env.REDIS_TOKEN,
});

export default redis;

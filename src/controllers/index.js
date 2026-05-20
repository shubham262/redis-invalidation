import { createCacheKey, generateProduct } from "../helper/index.js";
import redis from "../config/index.js";
import db from "../model/index.js";
const { Product } = db;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1000 of cahing keys stored in redis

export const getProductsController = async (req, res) => {
	try {
		const cacheKey = await createCacheKey(req.query || {});
		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				...cached,
			});
		}

		const { category, status = "active", page = 1, limit = 20 } = req.query;
		const filter = { status };
		if (category) filter.category = category;

		const skip = (Number(page) - 1) * Number(limit);

		await sleep(2000);

		const [products, total] = await Promise.all([
			Product.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(Number(limit))
				.lean(), // lean() returns plain JS objects — faster than Mongoose docs
			Product.countDocuments(filter), // N+1 style: two separate DB calls
		]);

		const response = {
			pagination: {
				total,
				page: Number(page),
				limit: Number(limit),
				totalPages: Math.ceil(total / Number(limit)),
			},
			data: products,
		};
		await redis.set(cacheKey, response, { ex: 60 });

		return res.status(200).json({
			success: true,
			source: "database",
			...response,
		});
	} catch (error) {
		console.log("error==>getDetailsController", error);
		return res.status(500).json({
			success: false,
			error: error?.message || "Failed to fetch details",
		});
	}
};

///cahce versioning
const updateExistingCache = async () => {
	try {
		// const cacheKey = createCacheKey({});
		
		
		await redis.incr("VERSION");
	} catch (error) {
		console.log("error==>updateExistingCache", error);
	}
};

// write throgh apporach

// const updateExistingCache = async () => {
// 	try {
// 		const cacheKey = createCacheKey({});
// 		const status = "active",
// 			page = 1,
// 			limit = 20;
// 		const filter = { status };

// 		const skip = (Number(page) - 1) * Number(limit);
// 		const [products, total] = await Promise.all([
// 			Product.find(filter)
// 				.sort({ createdAt: -1 })
// 				.skip(skip)
// 				.limit(Number(limit))
// 				.lean(), // lean() returns plain JS objects — faster than Mongoose docs
// 			Product.countDocuments(filter), // N+1 style: two separate DB calls
// 		]);

// 		const response = {
// 			pagination: {
// 				total,
// 				page: Number(page),
// 				limit: Number(limit),
// 				totalPages: Math.ceil(total / Number(limit)),
// 			},
// 			data: products,
// 		};
// 		await redis.set(cacheKey, response, { ex: 60 });
// 	} catch (error) {
// 		console.log("error==>updateExistingCache", error);
// 	}
// };

export const updateProductController = async (req, res) => {
	try {
		const { payloadForUpdate = {} } = req.body || {};
		const { id } = req.params || {};
		if (!id) {
			return res.status(500).json({
				message: "Product Id is required",
			});
		}

		const product = await Product.findByIdAndUpdate(id, payloadForUpdate, {
			returnDocument: "after",
		});

		if (!product) {
			return res.status(500).json({
				message: "Product Id is not valid",
			});
		}

		await updateExistingCache();

		//delete on write strategy

		/// await redis.del("products")

		//for deleting all keys matching given pattern

		// const pattern="products*"
		// const keys=await redis.keys(pattern)
		// if(keys.length){
		// 	await redis.del(...keys);
		// }

		return res.status(200).json({
			success: true,
			source: "database",
			data: product,
		});
	} catch (error) {
		console.log("error==>updateProductController", error);
		return res.status(500).json({
			success: false,
			error: error?.message || "Failed to fetch details",
		});
	}
};

export const seedProductsController = async (req, res) => {
	try {
		const count = req?.body?.count || 1000;
		const products = Array.from({ length: count }, (_, i) =>
			generateProduct(i + 1)
		);
		await Product.insertMany(products, { ordered: false });

		return res.status(201).json({
			success: true,
			message: `${count} products seeded successfully`,
			sample: products[0], // show one example in the response
		});
	} catch (error) {
		console.log("error==>seedProductsController", error);
		return res.status(500).json({
			success: false,
			error: error?.message || "Failed to fetch details",
		});
	}
};

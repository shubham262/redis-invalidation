import { generateProduct } from "../helper/index.js";
import db from "../model/index.js";
const { Product } = db;
export const getProductsController = async (req, res) => {
	try {
	} catch (error) {
		console.log("error==>getDetailsController", error);
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

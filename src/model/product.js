import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true, // e.g. "apple-iphone-15-pro"
		},

		description: {
			type: String,
			required: true,
		},

		price: {
			type: Number,
			required: true,
			min: 0,
		},

		discountedPrice: {
			type: Number,
			default: null,
			min: 0, // null means no active discount
		},

		category: {
			type: String,
			enum: [
				"electronics",
				"clothing",
				"furniture",
				"books",
				"sports",
				"beauty",
				"toys",
				"groceries",
			],
			required: true,
		},

		brand: {
			type: String,
			required: true,
			trim: true,
		},

		stock: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},

		status: {
			type: String,
			enum: ["active", "out_of_stock", "discontinued"],
			default: "active",
			required: true,
		},

		ratings: {
			average: {
				type: Number,
				default: 0,
				min: 0,
				max: 5,
			},
			count: {
				type: Number,
				default: 0,
			},
		},

		tags: {
			type: [String],
			default: [], // e.g. ["wireless", "noise-cancelling", "premium"]
		},

		imageUrl: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

// Index for common query patterns you'll cache
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "ratings.average": -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;

import redis from "../config/index.js";

const categories = [
	"electronics",
	"clothing",
	"furniture",
	"books",
	"sports",
	"beauty",
	"toys",
	"groceries",
];

const brands = {
	electronics: ["Apple", "Samsung", "Sony", "OnePlus", "Bosch"],
	clothing: ["Nike", "Adidas", "Zara", "H&M", "Levi's"],
	furniture: ["IKEA", "Durian", "Urban Ladder", "Pepperfry", "Godrej"],
	books: ["Penguin", "HarperCollins", "Scholastic", "Rupa", "Westland"],
	sports: ["Decathlon", "Nike", "Adidas", "Yonex", "Cosco"],
	beauty: ["Lakme", "Maybelline", "L'Oreal", "Nykaa", "Biotique"],
	toys: ["Lego", "Funskool", "Mattel", "Hasbro", "Fisher-Price"],
	groceries: ["Amul", "Nestle", "ITC", "Britannia", "Dabur"],
};

const productNames = {
	electronics: [
		"Wireless Earbuds",
		"4K Smart TV",
		"Mechanical Keyboard",
		"USB-C Hub",
		"Webcam HD",
	],
	clothing: [
		"Running Shorts",
		"Cotton T-Shirt",
		"Denim Jacket",
		"Yoga Pants",
		"Formal Shirt",
	],
	furniture: [
		"Ergonomic Chair",
		"Standing Desk",
		"Bookshelf",
		"Coffee Table",
		"Bedside Lamp",
	],
	books: [
		"Clean Code",
		"Atomic Habits",
		"Deep Work",
		"The Pragmatic Programmer",
		"Zero to One",
	],
	sports: [
		"Badminton Racket",
		"Yoga Mat",
		"Resistance Bands",
		"Cycling Gloves",
		"Jump Rope",
	],
	beauty: [
		"Sunscreen SPF50",
		"Moisturiser",
		"Lip Balm",
		"Face Wash",
		"Serum Vitamin C",
	],
	toys: [
		"Building Blocks",
		"Remote Car",
		"Puzzle Set",
		"Action Figure",
		"Board Game",
	],
	groceries: [
		"Organic Honey",
		"Basmati Rice",
		"Olive Oil",
		"Green Tea",
		"Protein Bar",
	],
};

const tags = [
	"trending",
	"bestseller",
	"new-arrival",
	"limited-edition",
	"eco-friendly",
	"premium",
	"budget-friendly",
	"imported",
];

function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSlug(name, brand, index) {
	return `${brand}-${name}-${index}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export const generateProduct = (index) => {
	const category = getRandom(categories);
	const brand = getRandom(brands[category]);
	const name = getRandom(productNames[category]);
	const price = getRandomInt(199, 49999);
	const hasDiscount = Math.random() > 0.5;
	const stock = getRandomInt(0, 500);

	return {
		name: `${brand} ${name}`,
		slug: generateSlug(name, brand, index),
		description: `High quality ${name.toLowerCase()} from ${brand}. Trusted by thousands of customers across India.`,
		price,
		discountedPrice: hasDiscount ? Math.floor(price * 0.8) : null,
		category,
		brand,
		stock,
		status: stock === 0 ? "out_of_stock" : "active",
		ratings: {
			average: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 – 5.0
			count: getRandomInt(10, 5000),
		},
		tags: [getRandom(tags), getRandom(tags)].filter(
			(v, i, a) => a.indexOf(v) === i
		),
		imageUrl: `https://picsum.photos/seed/${index}/400/400`,
	};
};

export const getCurrentVersion = async () => {
	let version = await redis.get("VERSION");
	if (!version) {
		version = await redis.set("VERSION", 1);
	}
	return version;
};

export const createCacheKey = async (query) => {
	const { category = "all", status = "active", page = 1, limit = 20 } = query;

	const currentVersion = await getCurrentVersion();
	return `v${currentVersion}:products:${category}:${status}:page=${page}:limit=${limit}`;
};

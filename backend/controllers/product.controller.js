import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const { category, search, sort, featured } = req.query;
		let query = {};

		if (category && category !== "all") {
			const catLower = category.toLowerCase();
			if (catLower === "shoes" || catLower === "footwear") {
				query.category = { $in: ["shoes", "footwear"] };
			} else if (["fashion", "clothing", "t-shirts", "jeans", "jackets", "suits"].includes(catLower)) {
				query.category = { $in: ["fashion", "clothing", "t-shirts", "jeans", "jackets", "suits", catLower] };
			} else if (["accessories", "bags", "glasses"].includes(catLower)) {
				query.category = { $in: ["accessories", "bags", "glasses", catLower] };
			} else if (["home", "furniture", "home and furniture"].includes(catLower)) {
				query.category = { $in: ["home", "furniture", "home-furniture", catLower] };
			} else if (["beauty", "lifestyle", "beauty and lifestyle"].includes(catLower)) {
				query.category = { $in: ["beauty", "lifestyle", "beauty-lifestyle", catLower] };
			} else {
				query.category = catLower;
			}
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ brand: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
			];
		}

		if (featured === "true") {
			query.isFeatured = true;
		}

		let sortOption = { createdAt: -1 };
		if (sort === "price-asc") sortOption = { price: 1 };
		else if (sort === "price-desc") sortOption = { price: -1 };
		else if (sort === "rating") sortOption = { rating: -1 };
		else if (sort === "popular" || sort === "featured") sortOption = { isFeatured: -1, rating: -1 };

		const products = await Product.find(query).sort(sortOption);
		res.json({ products, total: products.length });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		let product = null;

		if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
			product = await Product.findById(id);
		} else if (id) {
			product = await Product.findOne({
				$or: [
					{ name: { $regex: new RegExp(`^${id}$`, "i") } },
					{ name: { $regex: new RegExp(id.replace(/-/g, " "), "i") } },
				],
			});
		}

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		console.log("Error in getProductById controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
					discountPrice: 1,
					category: 1,
					brand: 1,
					rating: 1,
					numReviews: 1,
					isFeatured: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const catLower = category.toLowerCase();
		let filter = { category: catLower };
		if (catLower === "shoes" || catLower === "footwear") {
			filter = { category: { $in: ["shoes", "footwear"] } };
		} else if (["fashion", "clothing", "t-shirts", "jeans", "jackets", "suits"].includes(catLower)) {
			filter = { category: { $in: ["fashion", "clothing", "t-shirts", "jeans", "jackets", "suits", catLower] } };
		} else if (["accessories", "bags", "glasses"].includes(catLower)) {
			filter = { category: { $in: ["accessories", "bags", "glasses", catLower] } };
		} else if (["home", "furniture", "home and furniture", "home-furniture"].includes(catLower)) {
			filter = { category: { $in: ["home", "furniture", "home-furniture", catLower] } };
		} else if (["beauty", "lifestyle", "beauty and lifestyle", "beauty-lifestyle"].includes(catLower)) {
			filter = { category: { $in: ["beauty", "lifestyle", "beauty-lifestyle", catLower] } };
		}
		const products = await Product.find(filter);
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		discountPrice: {
			type: Number,
			min: 0,
		},
		brand: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		countInStock: {
			type: Number,
			default: 15,
			min: 0,
		},
		rating: {
			type: Number,
			default: 4.5,
			min: 0,
			max: 5,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

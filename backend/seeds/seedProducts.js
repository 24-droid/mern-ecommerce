import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

// Set reliable public DNS for Windows / SRV resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const demoProducts = [
	// 1. Electronics
	{
		name: "Sony WH-1000XM5 Wireless Headphones",
		description:
			"Industry-leading noise canceling headphones with dual processors, 8 microphones, and Auto NC Optimizer. Features crystal-clear hands-free calling and up to 30-hour battery life with quick charging.",
		price: 399.99,
		discountPrice: 349.99,
		category: "electronics",
		brand: "Sony",
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
		countInStock: 25,
		rating: 4.8,
		numReviews: 320,
		isFeatured: true,
	},
	{
		name: "Apple MacBook Pro 16-inch M3 Max",
		description:
			"The ultimate pro laptop with Apple M3 Max chip, Liquid Retina XDR display, up to 128GB unified memory, and up to 22 hours of battery life. Built for the most demanding creative workflows.",
		price: 2499.0,
		discountPrice: 2349.0,
		category: "electronics",
		brand: "Apple",
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
		countInStock: 14,
		rating: 4.9,
		numReviews: 185,
		isFeatured: true,
	},
	{
		name: "Apple Watch Ultra 2 Titanium",
		description:
			"The most rugged and capable Apple Watch. Features a lightweight 49mm titanium case, extra-long battery life, precision dual-frequency GPS, and the brightest display ever.",
		price: 799.0,
		discountPrice: 749.0,
		category: "electronics",
		brand: "Apple",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
		countInStock: 30,
		rating: 4.9,
		numReviews: 240,
		isFeatured: true,
	},
	{
		name: "Canon EOS R5 Mirrorless Camera",
		description:
			"Professional full-frame mirrorless camera featuring 45 Megapixel CMOS sensor, 8K RAW video recording, 5-axis in-body image stabilization, and dual pixel CMOS AF II.",
		price: 3899.0,
		discountPrice: 3599.0,
		category: "electronics",
		brand: "Canon",
		image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
		countInStock: 8,
		rating: 4.7,
		numReviews: 94,
		isFeatured: false,
	},
	{
		name: "Bose SoundLink Revolve+ II Bluetooth Speaker",
		description:
			"Deep, loud, and immersive 360-degree portable wireless speaker. Seamless aluminum body with IP55 water and dust resistance, built-in microphone, and up to 17 hours of battery life.",
		price: 329.0,
		discountPrice: 299.0,
		category: "electronics",
		brand: "Bose",
		image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
		countInStock: 45,
		rating: 4.6,
		numReviews: 142,
		isFeatured: false,
	},
	{
		name: "Logitech MX Master 3S Wireless Mouse",
		description:
			"Precision performance wireless mouse with 8K DPI any-surface tracking, quiet clicks, and MagSpeed electromagnetic scrolling. Ergonomic silhouette crafted for palm comfort.",
		price: 99.99,
		discountPrice: 89.99,
		category: "electronics",
		brand: "Logitech",
		image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
		countInStock: 60,
		rating: 4.8,
		numReviews: 512,
		isFeatured: false,
	},

	// 2. Fashion and Clothing (jeans, t-shirts, jackets, suits)
	{
		name: "Levi's 501 Original Fit Jeans",
		description:
			"The original blue jean since 1873. Straight leg silhouette with the signature button fly, crafted from 100% heavyweight cotton denim designed to mold uniquely to your body.",
		price: 79.5,
		discountPrice: 69.99,
		category: "jeans",
		brand: "Levi's",
		image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop&q=80",
		countInStock: 50,
		rating: 4.7,
		numReviews: 410,
		isFeatured: true,
	},
	{
		name: "Everlane Premium Heavyweight Crew T-Shirt",
		description:
			"A true wardrobe foundation made from certified organic combed cotton with a substantial 6.2 oz weight. Clean-cut crew neckline with reinforced collar stitching.",
		price: 40.0,
		discountPrice: 32.0,
		category: "t-shirts",
		brand: "Everlane",
		image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
		countInStock: 100,
		rating: 4.5,
		numReviews: 290,
		isFeatured: false,
	},
	{
		name: "Patagonia Classic Retro-X Fleece Jacket",
		description:
			"A windproof, warm fleece jacket made with 100% polyester (85% recycled) bonded Sherpa fleece. Fair Trade Certified sewn with vertical-zippered chest pocket.",
		price: 229.0,
		discountPrice: 199.0,
		category: "jackets",
		brand: "Patagonia",
		image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
		countInStock: 22,
		rating: 4.9,
		numReviews: 310,
		isFeatured: true,
	},
	{
		name: "Hugo Boss Slim-Fit Italian Wool Suit",
		description:
			"Impeccably tailored two-piece suit crafted in Italy from virgin wool. Fully lined notch-lapel jacket paired with flat-front trousers for executive sophistication.",
		price: 895.0,
		discountPrice: 795.0,
		category: "suits",
		brand: "Hugo Boss",
		image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
		countInStock: 15,
		rating: 4.8,
		numReviews: 87,
		isFeatured: true,
	},
	{
		name: "Madewell High-Rise Vintage Skinny Jeans",
		description:
			"Flattering 10-inch high rise denim with Magic Pockets that hold you in. Premium stretch Turkish cotton blend designed to retain its shape wear after wear.",
		price: 128.0,
		discountPrice: 98.0,
		category: "jeans",
		brand: "Madewell",
		image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
		countInStock: 35,
		rating: 4.6,
		numReviews: 175,
		isFeatured: false,
	},
	{
		name: "Schott NYC Leather Moto Jacket",
		description:
			"Handcrafted iconic American steerhide leather motorcycle jacket. Features asymmetrical front zipper, snap-down collar, adjustable waist belt, and insulated lining.",
		price: 950.0,
		discountPrice: 850.0,
		category: "jackets",
		brand: "Schott NYC",
		image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80",
		countInStock: 12,
		rating: 4.9,
		numReviews: 112,
		isFeatured: false,
	},

	// 3. Footwear (shoes)
	{
		name: "Nike Air Jordan 1 Retro High OG",
		description:
			"The sneaker that started it all. Genuine leather upper, encapsulated Nike Air cushioning, padded collar, and durable rubber cupsole with iconic pivot circle tread.",
		price: 180.0,
		discountPrice: 165.0,
		category: "shoes",
		brand: "Nike",
		image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
		countInStock: 40,
		rating: 4.9,
		numReviews: 680,
		isFeatured: true,
	},
	{
		name: "Adidas Ultraboost Light Running Shoes",
		description:
			"Experience epic energy with the lightest Ultraboost ever made. Light BOOST midsole cushioning paired with PRIMEKNIT+ textile upper and Continental rubber outsole.",
		price: 190.0,
		discountPrice: 149.99,
		category: "shoes",
		brand: "Adidas",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
		countInStock: 55,
		rating: 4.8,
		numReviews: 420,
		isFeatured: true,
	},
	{
		name: "New Balance 990v6 Made in USA",
		description:
			"A beacon of timeless running shoe heritage. Premium pigskin suede and mesh upper with FuelCell foam midsole cushioning for all-day comfort and stability.",
		price: 209.99,
		discountPrice: 189.99,
		category: "shoes",
		brand: "New Balance",
		image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
		countInStock: 28,
		rating: 4.7,
		numReviews: 215,
		isFeatured: false,
	},
	{
		name: "Red Wing Iron Ranger Leather Boots",
		description:
			"Rugged 6-inch heritage boot built with oil-tanned amber harness leather, chrome hardware, double-layer leather toe cap, and a Vibram 430 mini-lug outsole.",
		price: 349.99,
		discountPrice: 319.99,
		category: "shoes",
		brand: "Red Wing",
		image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
		countInStock: 18,
		rating: 4.9,
		numReviews: 190,
		isFeatured: false,
	},
	{
		name: "Birkenstock Arizona Oiled Leather Sandals",
		description:
			"Two-strap classic sandal with anatomically shaped cork-latex footbed. Oiled nubuck leather straps with individually adjustable metal pin buckles.",
		price: 140.0,
		discountPrice: 120.0,
		category: "shoes",
		brand: "Birkenstock",
		image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80",
		countInStock: 45,
		rating: 4.6,
		numReviews: 340,
		isFeatured: false,
	},
	{
		name: "Vans Old Skool Classic Skate Shoes",
		description:
			"The classic skate shoe that debuted the side stripe. Durable canvas and suede uppers, re-enforced toe caps, padded collars, and signature rubber waffle outsoles.",
		price: 70.0,
		discountPrice: 59.99,
		category: "shoes",
		brand: "Vans",
		image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
		countInStock: 70,
		rating: 4.5,
		numReviews: 510,
		isFeatured: false,
	},

	// 4. Home and Furniture (home)
	{
		name: "Herman Miller Aeron Ergonomic Office Chair",
		description:
			"The benchmark for ergonomic seating. Pellicle 8Z suspension material provides eight zones of varying tension. Adjustable PostureFit SL sacral and lumbar support.",
		price: 1395.0,
		discountPrice: 1249.0,
		category: "home",
		brand: "Herman Miller",
		image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=80",
		countInStock: 16,
		rating: 4.9,
		numReviews: 430,
		isFeatured: true,
	},
	{
		name: "Dyson V15 Detect Cordless Vacuum",
		description:
			"Dyson's most powerful, intelligent cordless vacuum. Laser reveals invisible dust on hard floors, piezo sensor sizes and counts dust particles, and Digital Motorbar detangles hair.",
		price: 749.99,
		discountPrice: 649.99,
		category: "home",
		brand: "Dyson",
		image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
		countInStock: 25,
		rating: 4.8,
		numReviews: 280,
		isFeatured: true,
	},
	{
		name: "West Elm Mid-Century Velvet Armchair",
		description:
			"Retro-inspired lounge chair with tapered solid wood legs and plush distressed velvet upholstery. Reversible high-resiliency foam cushion engineered for enduring comfort.",
		price: 699.0,
		discountPrice: 599.0,
		category: "home",
		brand: "West Elm",
		image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
		countInStock: 12,
		rating: 4.7,
		numReviews: 98,
		isFeatured: false,
	},
	{
		name: "Breville Barista Touch Espresso Machine",
		description:
			"Automated touchscreen espresso machine with built-in conical burr grinder. Delivers third-wave specialty coffee with automated microfoam milk texturing and 3-second heat up.",
		price: 999.95,
		discountPrice: 899.95,
		category: "home",
		brand: "Breville",
		image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
		countInStock: 20,
		rating: 4.8,
		numReviews: 310,
		isFeatured: false,
	},
	{
		name: "Le Creuset Enameled Cast Iron Dutch Oven 6-Qt",
		description:
			"Culinary classic engineered for superior heat distribution and retention. Vibrant porcelain enamel exterior is shock-resistant and dishwasher safe, oven safe up to 500°F.",
		price: 420.0,
		discountPrice: 375.0,
		category: "home",
		brand: "Le Creuset",
		image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
		countInStock: 30,
		rating: 4.9,
		numReviews: 540,
		isFeatured: false,
	},
	{
		name: "Article Minimalist Solid White Oak Coffee Table",
		description:
			"Hand-joined solid American white oak coffee table with clean Scandinavian lines, soft bullnose edges, and durable clear matte lacquer protection.",
		price: 449.0,
		discountPrice: 399.0,
		category: "home",
		brand: "Article",
		image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80",
		countInStock: 18,
		rating: 4.6,
		numReviews: 76,
		isFeatured: false,
	},

	// 5. Accessories (bags, glasses, accessories)
	{
		name: "Ray-Ban Classic Wayfarer Sunglasses",
		description:
			"An instantly recognizable staple since 1952. Polished black acetate frames with legendary G-15 polarized green crystal lenses offering 100% UV protection.",
		price: 171.0,
		discountPrice: 145.0,
		category: "glasses",
		brand: "Ray-Ban",
		image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
		countInStock: 65,
		rating: 4.8,
		numReviews: 620,
		isFeatured: true,
	},
	{
		name: "Bellroy Tokyo Leather Laptop Backpack 20L",
		description:
			"Sophisticated urban commuter backpack crafted from environmentally certified leather and water-resistant recycled ripstop. Padded pocket protects laptops up to 16 inches.",
		price: 239.0,
		discountPrice: 199.0,
		category: "bags",
		brand: "Bellroy",
		image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
		countInStock: 34,
		rating: 4.8,
		numReviews: 180,
		isFeatured: true,
	},
	{
		name: "The Ridge Minimalist RFID Blocking Wallet",
		description:
			"Modern dual-track slim wallet made from aerospace-grade aluminum. Holds 1-12 cards securely with integrated cash strap and lifetime warranty.",
		price: 95.0,
		discountPrice: 85.0,
		category: "accessories",
		brand: "The Ridge",
		image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
		countInStock: 80,
		rating: 4.7,
		numReviews: 440,
		isFeatured: false,
	},
	{
		name: "Tom Ford Snowdon Square Acetate Optical Glasses",
		description:
			"Distinguished square spectacles highlighted by shiny black acetate and signature rose gold T temple inlays. As featured on James Bond in Spectre.",
		price: 440.0,
		discountPrice: 385.0,
		category: "glasses",
		brand: "Tom Ford",
		image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
		countInStock: 15,
		rating: 4.7,
		numReviews: 64,
		isFeatured: false,
	},
	{
		name: "Herschel Little America Mountaineering Backpack",
		description:
			"Classic mountaineering silhouette with signature striped fabric liner, padded fleece-lined 15-inch laptop sleeve, magnetic strap closures, and front storage pocket.",
		price: 120.0,
		discountPrice: 99.0,
		category: "bags",
		brand: "Herschel",
		image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
		countInStock: 50,
		rating: 4.6,
		numReviews: 290,
		isFeatured: false,
	},
	{
		name: "Seiko 5 Sports Automatic Stainless Steel Watch",
		description:
			"Reliable Japanese automatic caliber 4R36 movement with manual winding capability. Hardlex crystal, luminescent hands, 100m water resistance, and transparent case back.",
		price: 295.0,
		discountPrice: 249.0,
		category: "accessories",
		brand: "Seiko",
		image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
		countInStock: 26,
		rating: 4.8,
		numReviews: 320,
		isFeatured: false,
	},

	// 6. Beauty and Lifestyle (beauty)
	{
		name: "Dyson Airwrap Multi-Styler Complete Long",
		description:
			"Style hair with the Coanda effect instead of extreme heat. Includes redesigned barrels to curl and wave in both directions, brushes to control and shape, and multi-functional Coanda smoothing dryer.",
		price: 599.99,
		discountPrice: 549.99,
		category: "beauty",
		brand: "Dyson",
		image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
		countInStock: 18,
		rating: 4.8,
		numReviews: 530,
		isFeatured: true,
	},
	{
		name: "Le Labo Santal 33 Eau de Parfum (100ml)",
		description:
			"An intoxicating unisex woody fragrance with cardamon, iris, violet, ambrox, and cedarwood. Blended by master perfumers in New York.",
		price: 320.0,
		discountPrice: 295.0,
		category: "beauty",
		brand: "Le Labo",
		image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
		countInStock: 22,
		rating: 4.9,
		numReviews: 280,
		isFeatured: true,
	},
	{
		name: "Aesop Resurrection Aromatique Hand Care Trio",
		description:
			"A lavish trio of botanical hand wash, moisturizing hand balm, and rinse-free hand cleanser scented with mandarin rind, rosemary leaf, and cedar atlas.",
		price: 135.0,
		discountPrice: 115.0,
		category: "beauty",
		brand: "Aesop",
		image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80",
		countInStock: 40,
		rating: 4.7,
		numReviews: 165,
		isFeatured: false,
	},
	{
		name: "La Mer Crème de la Mer Moisturizing Face Cream",
		description:
			"The legendary ultra-rich face cream infused with cell-supporting Miracle Broth. Calms redness, diminishes lines, and infuses skin with moisture for renewed radiance.",
		price: 380.0,
		discountPrice: 345.0,
		category: "beauty",
		brand: "La Mer",
		image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
		countInStock: 14,
		rating: 4.7,
		numReviews: 210,
		isFeatured: false,
	},
	{
		name: "Theragun PRO Plus Deep Tissue Massage Gun",
		description:
			"Next-generation handheld percussive therapy device combining 16mm deep-muscle percussion, near-infrared LED light therapy, vibration, and thermal warmth treatments.",
		price: 599.0,
		discountPrice: 499.0,
		category: "beauty",
		brand: "Therabody",
		image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
		countInStock: 20,
		rating: 4.8,
		numReviews: 145,
		isFeatured: false,
	},
	{
		name: "Kiehl's Ultimate Facial Fuel Skincare Set",
		description:
			"Energizing men's skincare essentials powered by caffeine and vitamins C & E. Includes Facial Fuel Cleanser, Moisture Treatment, and Scrub for refreshed, revitalized skin.",
		price: 68.0,
		discountPrice: 58.0,
		category: "beauty",
		brand: "Kiehl's",
		image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
		countInStock: 50,
		rating: 4.6,
		numReviews: 190,
		isFeatured: false,
	},
];

export const seedDatabase = async () => {
	try {
		console.log("Connecting to MongoDB...");
		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI is missing from environment variables.");
		}

		await mongoose.connect(process.env.MONGO_URI);
		console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

		let insertedCount = 0;
		let updatedCount = 0;

		for (const productData of demoProducts) {
			const existing = await Product.findOne({ name: productData.name });
			if (existing) {
				await Product.updateOne({ _id: existing._id }, { $set: productData });
				updatedCount++;
			} else {
				await Product.create(productData);
				insertedCount++;
			}
		}

		console.log(
			`Seeding complete! Successfully inserted ${insertedCount} new products and updated ${updatedCount} existing products.`
		);
		console.log(`Total demo products in database: ${await Product.countDocuments()}`);

		// Refresh featured products cache
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
		console.log(`Featured products cache updated with ${featuredProducts.length} items.`);

		await mongoose.disconnect();
		console.log("MongoDB disconnected cleanly.");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error.message);
		if (mongoose.connection.readyState !== 0) {
			await mongoose.disconnect();
		}
		process.exit(1);
	}
};

// Execute if run directly
if (process.argv[1]?.endsWith("seedProducts.js") || process.argv[1]?.endsWith("seedProducts")) {
	seedDatabase();
}


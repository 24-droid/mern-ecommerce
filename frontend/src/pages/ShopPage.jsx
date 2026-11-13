import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, ArrowUpDown, Filter, RotateCcw } from "lucide-react";

const categories = [
	{ id: "all", label: "All Products" },
	{ id: "electronics", label: "Electronics" },
	{ id: "home", label: "Home & Furniture" },
	{ id: "beauty", label: "Beauty & Lifestyle" },
	{ id: "shoes", label: "Footwear" },
	{ id: "jeans", label: "Jeans" },
	{ id: "t-shirts", label: "T-Shirts" },
	{ id: "jackets", label: "Jackets" },
	{ id: "suits", label: "Suits" },
	{ id: "bags", label: "Bags" },
	{ id: "glasses", label: "Glasses" },
	{ id: "accessories", label: "Accessories" },
];

const ShopPage = () => {
	const { fetchAllProducts, products, isLoading } = useProductStore();
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("featured");

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	const filteredProducts = useMemo(() => {
		if (!products) return [];

		let list = [...products];

		// Category filter
		if (selectedCategory !== "all") {
			const cat = selectedCategory.toLowerCase();
			if (cat === "shoes" || cat === "footwear") {
				list = list.filter((p) => p.category === "shoes" || p.category === "footwear");
			} else if (cat === "home") {
				list = list.filter((p) => p.category === "home" || p.category === "furniture");
			} else if (cat === "beauty") {
				list = list.filter((p) => p.category === "beauty" || p.category === "lifestyle");
			} else if (cat === "accessories") {
				list = list.filter((p) => ["accessories", "bags", "glasses"].includes(p.category));
			} else {
				list = list.filter((p) => p.category?.toLowerCase() === cat);
			}
		}

		// Search filter
		if (searchTerm.trim()) {
			const term = searchTerm.toLowerCase();
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(term) ||
					p.description?.toLowerCase().includes(term) ||
					p.brand?.toLowerCase().includes(term) ||
					p.category?.toLowerCase().includes(term)
			);
		}

		// Sorting
		if (sortBy === "price-low") {
			list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
		} else if (sortBy === "price-high") {
			list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
		} else if (sortBy === "rating") {
			list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
		} else if (sortBy === "featured") {
			list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
		}

		return list;
	}, [products, selectedCategory, searchTerm, sortBy]);

	const resetFilters = () => {
		setSelectedCategory("all");
		setSearchTerm("");
		setSortBy("featured");
	};

	return (
		<div className='min-h-screen pb-20'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-center mb-8'
				>
					<h1 className='text-4xl sm:text-5xl font-bold text-emerald-400 mb-3'>
						Shop All Products
					</h1>
					<p className='text-gray-300 text-sm sm:text-base max-w-2xl mx-auto'>
						Discover our complete catalog of premium electronics, fashion, footwear, home essentials, and lifestyle goods.
					</p>
				</motion.div>

				{/* Category Pills */}
				<div className='flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-gray-700'>
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => setSelectedCategory(cat.id)}
							className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
								selectedCategory === cat.id
									? "bg-emerald-500 text-gray-900 font-semibold shadow-md shadow-emerald-500/20"
									: "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
							}`}
						>
							{cat.label}
						</button>
					))}
				</div>

				{/* Search & Sort Controls Bar */}
				<div className='bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between'>
					{/* Search Bar */}
					<div className='relative w-full md:w-96'>
						<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
						<input
							type='text'
							placeholder='Search products by name, brand, or description...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500'
						/>
					</div>

					{/* Count, Reset & Sort */}
					<div className='flex items-center justify-between md:justify-end w-full md:w-auto gap-4'>
						<span className='text-xs sm:text-sm text-gray-400'>
							Showing <strong className='text-white'>{filteredProducts.length}</strong> of {products.length} products
						</span>

						{(searchTerm || selectedCategory !== "all" || sortBy !== "featured") && (
							<button
								onClick={resetFilters}
								className='text-xs text-gray-400 hover:text-emerald-400 flex items-center transition-colors'
								title='Reset all filters'
							>
								<RotateCcw size={14} className='mr-1' /> Reset
							</button>
						)}

						<div className='flex items-center gap-2'>
							<ArrowUpDown size={16} className='text-gray-400' />
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer'
							>
								<option value='featured'>Sort By: Featured</option>
								<option value='price-low'>Price: Low to High</option>
								<option value='price-high'>Price: High to Low</option>
								<option value='rating'>Highest Rated</option>
							</select>
						</div>
					</div>
				</div>

				{/* Products Grid */}
				{isLoading ? (
					<div className='py-20'>
						<LoadingSpinner />
					</div>
				) : (
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						{filteredProducts.length === 0 ? (
							<div className='col-span-full text-center py-20 bg-gray-800/40 border border-gray-700/60 rounded-xl p-8'>
								<Filter size={40} className='mx-auto text-gray-500 mb-3' />
								<h2 className='text-2xl font-semibold text-gray-300 mb-2'>
									No products match your filters
								</h2>
								<p className='text-gray-400 text-sm mb-6'>
									Try adjusting your search query or selecting a different category.
								</p>
								<button
									onClick={resetFilters}
									className='bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors'
								>
									Reset All Filters
								</button>
							</div>
						) : (
							filteredProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ShopPage;


import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Search, ArrowUpDown, ArrowLeft } from "lucide-react";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, isLoading } = useProductStore();
	const { category } = useParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("default");

	useEffect(() => {
		fetchProductsByCategory(category);
		setSearchTerm("");
		setSortBy("default");
	}, [fetchProductsByCategory, category]);

	const filteredProducts = useMemo(() => {
		if (!products) return [];
		let list = products.filter((p) => {
			const term = searchTerm.toLowerCase();
			return (
				p.name.toLowerCase().includes(term) ||
				p.description?.toLowerCase().includes(term) ||
				p.brand?.toLowerCase().includes(term)
			);
		});

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
	}, [products, searchTerm, sortBy]);

	const formattedCategory =
		category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

	return (
		<div className='min-h-screen pb-16'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
				<div className='mb-6'>
					<Link
						to='/'
						className='inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors'
					>
						<ArrowLeft size={16} className='mr-1.5' /> Back to Home
					</Link>
				</div>

				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-center mb-10'
				>
					<h1 className='text-4xl sm:text-5xl font-bold text-emerald-400 mb-2'>
						{formattedCategory}
					</h1>
					<p className='text-gray-300 text-sm sm:text-base'>
						Explore our handpicked collection in {formattedCategory}
					</p>
				</motion.div>

				{/* Search & Sort Controls */}
				<div className='bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between'>
					{/* Search */}
					<div className='relative w-full sm:w-80'>
						<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
						<input
							type='text'
							placeholder={`Search in ${formattedCategory}...`}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500'
						/>
					</div>

					{/* Count & Sort */}
					<div className='flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4'>
						<span className='text-xs text-gray-400'>
							{filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} found
						</span>

						<div className='flex items-center gap-2'>
							<ArrowUpDown size={16} className='text-gray-400' />
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer'
							>
								<option value='default'>Sort By: Featured</option>
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
							<div className='col-span-full text-center py-16 bg-gray-800/40 border border-gray-700/60 rounded-xl p-8'>
								<h2 className='text-2xl font-semibold text-gray-300 mb-2'>
									No products found
								</h2>
								<p className='text-gray-400 text-sm mb-6'>
									{searchTerm
										? `No products match your search "${searchTerm}".`
										: "There are currently no products in this category."}
								</p>
								<Link
									to='/shop'
									className='inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors'
								>
									Browse All Products
								</Link>
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
export default CategoryPage;

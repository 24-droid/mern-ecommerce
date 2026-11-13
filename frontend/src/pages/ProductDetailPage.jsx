import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import {
	ShoppingCart,
	Star,
	ArrowLeft,
	ShieldCheck,
	Truck,
	RotateCcw,
	Plus,
	Minus,
	CheckCircle2,
} from "lucide-react";
import axios from "../lib/axios";

const ProductDetailPage = () => {
	const { id } = useParams();
	const { fetchProductById } = useProductStore();
	const { addToCart } = useCartStore();
	const { user } = useUserStore();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [recommended, setRecommended] = useState([]);

	useEffect(() => {
		let isMounted = true;
		const loadProduct = async () => {
			setLoading(true);
			const data = await fetchProductById(id);
			if (isMounted) {
				setProduct(data);
				setLoading(false);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		};

		loadProduct();
		return () => {
			isMounted = false;
		};
	}, [id]);

	useEffect(() => {
		const loadRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommended(res.data || []);
			} catch (err) {
				console.error("Failed to load recommendations:", err);
			}
		};
		loadRecommendations();
	}, [id]);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		for (let i = 0; i < quantity; i++) {
			addToCart(product);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen py-24'>
				<LoadingSpinner />
			</div>
		);
	}

	if (!product) {
		return (
			<div className='min-h-screen py-24 text-center'>
				<h2 className='text-3xl font-bold text-gray-300 mb-4'>Product Not Found</h2>
				<p className='text-gray-400 mb-6'>The product you are looking for does not exist or has been removed.</p>
				<Link
					to='/shop'
					className='inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors'
				>
					Back to Shop
				</Link>
			</div>
		);
	}

	const rawDisplay = product.discountPrice || product.price || 0;
	const displayPrice = typeof rawDisplay === "number" ? rawDisplay : parseFloat(rawDisplay) || 0;
	const originalPrice = product.discountPrice ? (typeof product.price === "number" ? product.price : parseFloat(product.price) || 0) : null;
	const savings = originalPrice && originalPrice > displayPrice ? (originalPrice - displayPrice).toFixed(2) : null;

	return (
		<div className='min-h-screen pb-20'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Breadcrumb Navigation */}
				<div className='mb-6 flex items-center text-sm text-gray-400 gap-2'>
					<Link to='/' className='hover:text-emerald-400 transition-colors'>
						Home
					</Link>
					<span>/</span>
					<Link to='/shop' className='hover:text-emerald-400 transition-colors'>
						Shop
					</Link>
					<span>/</span>
					<Link to={`/category/${product.category}`} className='hover:text-emerald-400 transition-colors capitalize'>
						{product.category}
					</Link>
					<span>/</span>
					<span className='text-gray-200 truncate max-w-xs'>{product.name}</span>
				</div>

				<div className='bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-10 shadow-2xl mb-16'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
						{/* Product Image */}
						<div className='relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 group'>
							<img
								src={product.image}
								alt={product.name}
								className='w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105'
							/>
							{product.isFeatured && (
								<span className='absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg'>
									Featured Pick
								</span>
							)}
							{originalPrice && (
								<span className='absolute top-4 right-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg'>
									Save ${savings}
								</span>
							)}
						</div>

						{/* Product Details Info */}
						<div className='flex flex-col justify-between'>
							<div>
								{product.brand && (
									<p className='text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-2'>
										{product.brand}
									</p>
								)}
								<h1 className='text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight'>
									{product.name}
								</h1>

								{/* Ratings & Category */}
								<div className='flex flex-wrap items-center gap-4 mb-6'>
									<div className='flex items-center text-yellow-400 gap-1'>
										<Star size={18} className='fill-yellow-400' />
										<span className='font-bold text-sm text-white'>
											{product.rating ? product.rating.toFixed(1) : "4.8"}
										</span>
										<span className='text-xs text-gray-400'>
											({product.numReviews ? product.numReviews : "120+"} customer reviews)
										</span>
									</div>

									<span className='text-gray-600'>|</span>

									<Link
										to={`/category/${product.category}`}
										className='text-xs font-medium uppercase tracking-wide bg-gray-700/80 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors'
									>
										Category: {product.category}
									</Link>
								</div>

								{/* Price */}
								<div className='mb-6 p-4 rounded-xl bg-gray-900/60 border border-gray-700/60 flex items-baseline gap-3'>
									<span className='text-4xl font-extrabold text-emerald-400'>
										${displayPrice.toFixed(2)}
									</span>
									{originalPrice && (
										<>
											<span className='text-xl text-gray-400 line-through'>
												${originalPrice.toFixed(2)}
											</span>
											<span className='text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded'>
												Save ${(originalPrice - displayPrice).toFixed(2)}
											</span>
										</>
									)}
								</div>

								{/* Stock Status */}
								<div className='flex items-center gap-2 mb-6 text-sm'>
									<CheckCircle2 size={18} className='text-emerald-400' />
									<span className='text-emerald-400 font-semibold'>In Stock</span>
									<span className='text-gray-400'>
										({product.countInStock || 15} units available ready to ship)
									</span>
								</div>

								{/* Description */}
								<div className='mb-8'>
									<h3 className='text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2'>
										Description
									</h3>
									<p className='text-gray-300 leading-relaxed text-sm sm:text-base'>
										{product.description}
									</p>
								</div>
							</div>

							{/* Actions: Quantity + Add to Cart */}
							<div className='border-t border-gray-700 pt-6'>
								<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6'>
									{/* Quantity selector */}
									<div className='flex items-center justify-between border border-gray-600 bg-gray-900 rounded-lg px-3 py-2 w-full sm:w-36'>
										<button
											onClick={() => setQuantity((q) => Math.max(1, q - 1))}
											className='text-gray-400 hover:text-white p-1'
										>
											<Minus size={16} />
										</button>
										<span className='font-bold text-white'>{quantity}</span>
										<button
											onClick={() => setQuantity((q) => Math.min(product.countInStock || 20, q + 1))}
											className='text-gray-400 hover:text-white p-1'
										>
											<Plus size={16} />
										</button>
									</div>

									{/* Add to Cart button */}
									<button
										onClick={handleAddToCart}
										className='flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-emerald-600/30 transition-all text-base'
									>
										<ShoppingCart size={20} />
										Add to Cart • ${(displayPrice * quantity).toFixed(2)}
									</button>
								</div>

								{/* Guarantee badges */}
								<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-700/60 text-xs text-gray-400'>
									<div className='flex items-center gap-2'>
										<Truck size={16} className='text-emerald-400 flex-shrink-0' />
										<span>Free US Shipping over $50</span>
									</div>
									<div className='flex items-center gap-2'>
										<RotateCcw size={16} className='text-emerald-400 flex-shrink-0' />
										<span>30-Day Hassle-Free Returns</span>
									</div>
									<div className='flex items-center gap-2'>
										<ShieldCheck size={16} className='text-emerald-400 flex-shrink-0' />
										<span>2-Year Warranty Included</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Recommended Products Carousel / Section */}
				{recommended.length > 0 && (
					<div className='mt-16'>
						<div className='flex items-center justify-between mb-8'>
							<div>
								<h2 className='text-2xl sm:text-3xl font-bold text-emerald-400'>
									You May Also Like
								</h2>
								<p className='text-gray-400 text-sm mt-1'>
									Handpicked recommendations complementary to this product
								</p>
							</div>
							<Link
								to='/shop'
								className='text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1'
							>
								View All <ArrowLeft size={16} className='rotate-180' />
							</Link>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
							{recommended.slice(0, 4).map((rec) => (
								<ProductCard key={rec._id} product={rec} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetailPage;


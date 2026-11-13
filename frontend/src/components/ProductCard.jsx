import toast from "react-hot-toast";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	const rawDisplay = product.discountPrice || product.price || 0;
	const displayPrice = typeof rawDisplay === "number" ? rawDisplay : parseFloat(rawDisplay) || 0;
	const originalPrice = product.discountPrice ? (typeof product.price === "number" ? product.price : parseFloat(product.price) || 0) : null;

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10 group'>
			<Link to={`/product/${product._id}`} className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img
					className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105'
					src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"}
					alt={product.name}
					loading='lazy'
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
					}}
				/>
				<div className='absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors' />
				{product.isFeatured && (
					<span className='absolute top-2 left-2 bg-emerald-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow'>
						Featured
					</span>
				)}
				{originalPrice && (
					<span className='absolute top-2 right-2 bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full shadow'>
						Sale
					</span>
				)}
			</Link>

			<div className='mt-4 px-5 pb-5 flex flex-col flex-1 justify-between'>
				<div>
					{product.brand && (
						<p className='text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1'>
							{product.brand}
						</p>
					)}
					<Link to={`/product/${product._id}`}>
						<h5 className='text-lg font-semibold tracking-tight text-white hover:text-emerald-400 transition-colors line-clamp-1'>
							{product.name}
						</h5>
					</Link>

					{/* Rating */}
					<div className='flex items-center gap-1.5 mt-2 mb-3'>
						<div className='flex items-center text-yellow-400'>
							<Star size={16} className='fill-yellow-400' />
							<span className='text-xs font-semibold text-gray-200 ml-1'>
								{product.rating ? product.rating.toFixed(1) : "4.5"}
							</span>
						</div>
						<span className='text-xs text-gray-400'>
							({product.numReviews ? product.numReviews : "20+"})
						</span>
					</div>
				</div>

				<div>
					<div className='mt-1 mb-4 flex items-baseline gap-2'>
						<span className='text-2xl font-bold text-emerald-400'>
							${displayPrice.toFixed(2)}
						</span>
						{originalPrice && (
							<span className='text-sm text-gray-400 line-through'>
								${originalPrice.toFixed(2)}
							</span>
						)}
					</div>

					<button
						className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
						 text-white hover:bg-emerald-500 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-800'
						onClick={handleAddToCart}
					>
						<ShoppingCart size={18} className='mr-2' />
						Add to cart
					</button>
				</div>
			</div>
		</div>
	);
};
export default ProductCard;

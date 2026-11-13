import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();
	const { user } = useUserStore();

	const handleAddToCart = (product) => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= (featuredProducts?.length || 0) - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-2'>Featured Products</h2>
				<p className='text-center text-gray-300 mb-8'>Handpicked trending items curated for you</p>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => {
								const rawDisplay = product.discountPrice || product.price || 0;
								const displayPrice = typeof rawDisplay === "number" ? rawDisplay : parseFloat(rawDisplay) || 0;
								const originalPrice = product.discountPrice ? (typeof product.price === "number" ? product.price : parseFloat(product.price) || 0) : null;

								return (
									<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
										<div className='bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl border border-emerald-500/30 group'>
											<div>
												<Link to={`/product/${product._id}`} className='block overflow-hidden relative'>
													<img
														src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"}
														alt={product.name}
														className='w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
														onError={(e) => {
															e.target.onerror = null;
															e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
														}}
													/>
													{originalPrice && (
														<span className='absolute top-2 right-2 bg-red-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
															Sale
														</span>
													)}
												</Link>
												<div className='p-4'>
													{product.brand && (
														<p className='text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1'>
															{product.brand}
														</p>
													)}
													<Link to={`/product/${product._id}`}>
														<h3 className='text-base font-semibold mb-2 text-white hover:text-emerald-400 transition-colors line-clamp-1'>
															{product.name}
														</h3>
													</Link>
													<div className='flex items-center gap-1 mb-2 text-yellow-400 text-xs font-semibold'>
														<Star size={14} className='fill-yellow-400' />
														<span>{product.rating ? product.rating.toFixed(1) : "4.5"}</span>
														<span className='text-gray-400 font-normal'>
															({product.numReviews || "10+"})
														</span>
													</div>
													<div className='flex items-baseline gap-2 mb-4'>
														<span className='text-emerald-300 font-bold text-xl'>
															${displayPrice.toFixed(2)}
														</span>
														{originalPrice && (
															<span className='text-gray-400 text-sm line-through'>
																${originalPrice.toFixed(2)}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className='p-4 pt-0'>
												<button
													onClick={() => handleAddToCart(product)}
													className='w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 
													flex items-center justify-center'
												>
													<ShoppingCart className='w-4 h-4 mr-2' />
													Add to Cart
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;

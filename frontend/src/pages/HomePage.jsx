import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{
		href: "/electronics",
		name: "Electronics",
		imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
	},
	{
		href: "/home",
		name: "Home & Furniture",
		imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
	},
	{
		href: "/beauty",
		name: "Beauty & Lifestyle",
		imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
	},
	{ href: "/shoes", name: "Footwear & Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/jeans", name: "Jeans & Denim", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts & Tops", imageUrl: "/tshirts.jpg" },
	{ href: "/jackets", name: "Jackets & Outerwear", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits & Tailoring", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags & Backpacks", imageUrl: "/bags.jpg" },
	{ href: "/glasses", name: "Glasses & Eyewear", imageUrl: "/glasses.png" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;

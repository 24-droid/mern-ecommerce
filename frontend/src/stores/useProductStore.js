import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,
	isLoading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true, isLoading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
				isLoading: false,
			}));
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to create product");
			set({ loading: false, isLoading: false });
		}
	},
	fetchAllProducts: async (filters = {}) => {
		set({ loading: true, isLoading: true });
		try {
			const params = new URLSearchParams();
			if (filters.category) params.append("category", filters.category);
			if (filters.search) params.append("search", filters.search);
			if (filters.sort) params.append("sort", filters.sort);
			if (filters.featured) params.append("featured", filters.featured);

			const queryString = params.toString() ? `?${params.toString()}` : "";
			const response = await axios.get(`/products${queryString}`);
			set({ products: response.data.products || [], loading: false, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, isLoading: false });
			toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch products");
		}
	},
	fetchProductById: async (productId) => {
		const cached = get().products?.find((p) => p._id === productId);
		if (cached) {
			return cached;
		}

		set({ loading: true, isLoading: true });
		try {
			const response = await axios.get(`/products/${productId}`);
			set({ loading: false, isLoading: false });
			return response.data;
		} catch (error) {
			set({ loading: false, isLoading: false });
			toast.error(error.response?.data?.message || "Failed to fetch product details");
			return null;
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true, isLoading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products || [], loading: false, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, isLoading: false });
			toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true, isLoading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
				isLoading: false,
			}));
		} catch (error) {
			set({ loading: false, isLoading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true, isLoading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
				isLoading: false,
			}));
		} catch (error) {
			set({ loading: false, isLoading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true, isLoading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data || [], loading: false, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false, isLoading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));

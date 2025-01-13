import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { withPersistAndDevtools } from "./persistStorage";

export const useProductStore = create(
  withPersistAndDevtools(
    (set, get) => ({
      products: [],
      loading: false,

      setProducts: (products) => set({ products }),

      createProduct: async (productData) => {
        set({ loading: true }, false, "Creating product start");
        try {
          const res = await axios.post("/products", productData);
          set(
            (prevState) => ({
              products: [...prevState.products, res.data],
              loading: false,
            }),
            false,
            "Creating product success"
          );
        } catch (error) {
          toast.error(error.response.data.message || "An error occurred");
          set({ loading: false }, false, "Creating product failure");
        }
      },

      fetchAllProducts: async () => {
        set({ loading: true }, false, "Fetching products start");
        try {
          const res = await axios.get("/products");
          set(
            { products: res.data, loading: false },
            false,
            "Fetching products success"
          );
        } catch (error) {
          toast.error(
            error.response.data.message || "Failed to fetch products"
          );
          set({ loading: false }, false, "Fetching products failure");
        }
      },

      fetchProductsByCategory: async (category) => {
        set({ loading: true }, false, "Fetching products by category start");
        try {
          const res = await axios.get(`/products/category/${category}`);
          set(
            { products: res.data.products, loading: false },
            false,
            "Fetching products by category success"
          );
        } catch (error) {
          toast.error(
            error.response.data.message ||
              "Failed to fetch products by category"
          );
          set(
            { loading: false },
            false,
            "Fetching products by category failure"
          );
        }
      },

      deleteProduct: async (productId) => {
        set({ loading: true }, false, "Deleting product start");
        try {
          await axios.delete(`/products/${productId}`);
          set(
            (prevState) => ({
              products: prevState.products.filter(
                (product) => product._id !== productId
              ),
              loading: false,
            }),
            false,
            "Deleting product success"
          );
        } catch (error) {
          toast.error(error.response.data.message || "An error occurred");
          set({ loading: false }, false, "Deleting product failure");
        }
      },

      toggleFeaturedProduct: async (productId) => {
        set({ loading: true }, false, "Toggling featured product start");
        try {
          const res = await axios.patch(`/products/${productId}`);
          set(
            (prevState) => ({
              products: prevState.products.map((product) =>
                product._id === productId
                  ? { ...product, isFeatured: res.data.isFeatured } // Убедитесь, что сервер возвращает актуальное состояние isFeatured
                  : product
              ),
              loading: false,
            }),
            false,
            "Toggling featured product success"
          );
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to toggle featured product"
          );
          set({ loading: false }, false, "Toggling featured product failure");
        }
      },
    }),
    "product"
  )
);

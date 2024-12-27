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
    }),
    "product"
  )
);

import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { withPersistAndDevtools } from "./persistStorage";

export const useCartStore = create(
  withPersistAndDevtools(
    (set, get) => ({
      cart: [],
      coupon: null,
      total: 0,
      subtotal: 0,
      isCouponApplied: false,

      getCartItems: async () => {
        try {
          const res = await axios.get("/cart");
          set({ cart: res.data });
          get().calculateTotals();
        } catch (error) {
          set({ cart: [] });
          toast.error(error.response.data.message || "An error occurred");
        }
      },

      addToCart: async (product) => {
        try {
          const res = await axios.post("/cart", { productId: product._id });
          toast.success(`${product.name} added to cart`, { id: "addToCart" });
          set((prevState) => {
            const existingItem = prevState.cart.find(
              (item) => item._id === product._id
            );
            const newCart = existingItem
              ? prevState.cart.map((item) =>
                  item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              : [...prevState.cart, { ...product, quantity: 1 }];
            return { cart: newCart };
          });
          get().calculateTotals();
        } catch (error) {
          toast.error(error.response.data.message || "An error occurred");
        }
      },

      removeFromCart: async (productId) => {
        await axios.delete(`/cart`, { data: { productId } });
        set((prevState) => ({
          cart: prevState.cart.filter((item) => item._id !== productId),
        }));
        get().calculateTotals();
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity === 0) return get().removeFromCart(productId);
        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
          cart: prevState.cart.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }));
        get().calculateTotals();
      },

      calculateTotals: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        let total = subtotal;
        if (coupon) {
          const discount = subtotal * (coupon.discount / 100);
          total = subtotal - discount;
        }
        set({ subtotal, total });
      },
    }),
    "cart"
  )
);

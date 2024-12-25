import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { withPersistAndDevtools } from "./persistStorage";

export const useUserStore = create(
  withPersistAndDevtools(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: false,

      signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true }, false, "Signup start");

        if (password !== confirmPassword) {
          set({ loading: false }, false, "Signup failure");
          return toast.error("Passwords do not match");
        }

        try {
          const res = await axios.post("/auth/signup", {
            name,
            email,
            password,
          });
          set({ user: res.data, loading: false }, false, "Signup success");
          window.location.href = "/";
        } catch (error) {
          set({ loading: false }, false, "Signup failure");
          toast.error(error.response.data.message || "An error occurred");
        }
      },

      login: async ({ email, password }) => {
        set({ loading: true }, false, "Login start");
        try {
          const res = await axios.post("/auth/login", {
            email,
            password,
          });
          set({ user: res.data, loading: false }, false, "Login success");
          window.location.href = "/";
        } catch (error) {
          set({ loading: false }, false, "Login failure");
          toast.error(error.response.data.message || "An error occurred");
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null }, false, "Logout success");
        } catch (error) {
          toast.error(error.response.data.message || "An error occurred");
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true }, false, "Checking auth start");
        try {
          const res = await axios.get("/auth/profile");
          set(
            { user: res.data, checkingAuth: false },
            false,
            "Checking auth success"
          );
        } catch (error) {
          set(
            { checkingAuth: false, user: null },
            false,
            "Checking auth failure"
          );
        }
      },
    }),
    "user"
  )
);

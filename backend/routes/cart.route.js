import express from "express";
import {
  addToCard,
  removeAllFromCart,
  updateQuantity,
  getCardProducts,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCardProducts);
router.post("/", protectRoute, addToCard);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;

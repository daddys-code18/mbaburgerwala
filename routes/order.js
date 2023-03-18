import express from "express";
import {
  getAdminOrders,
  getMyOrders,
  getOrdersDetails,
  paymentverification,
  placeOrder,
  placeOrderOnline,
  processOrder,
} from "../controllers/order.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";
const router = express.Router();
router.post("/createorder", isAuthenticated, placeOrder);
router.post("/createorderonline", isAuthenticated, placeOrderOnline);
router.post("/paymentverification", isAuthenticated, paymentverification);
router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getOrdersDetails);

//Add admin  Middleware
router.get("/admin/orders", isAuthenticated, authorizedAdmin, getAdminOrders);
router.get("/admin/order/:id", isAuthenticated, authorizedAdmin, processOrder);

export default router;

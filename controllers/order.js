import { asyncError } from "../middleware/errorMiddleware.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import ErrorHandler from "../utlis/ErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";
// Place Order By COD
export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemPrice,
    taxprice,
    shippingcharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;
  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemPrice,
    taxprice,
    shippingcharges,
    totalAmount,
    user,
  };
  await Order.create(orderOptions);
  res.status(201).json({
    success: true,
    message: "Order Placed SuccessFully Via Cashon Delivery",
  });
});
// for Online Payment razorpay
export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemPrice,
    taxprice,
    shippingcharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;
  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemPrice,
    taxprice,
    shippingcharges,
    totalAmount,
    user,
  };
  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});

export const paymentverification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    await Order.create({
      ...orderOptions,

      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });
    res.status(200).json({
      success: true,
      message: `Order placed  Succesfully .Payment ID:${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment Failed", 400));
  }
});
// finding order on basis of user id and adding user name to order object
export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name");
  res.status(200).json({
    success: true,
    orders,
  });
});
// Finding Order on basis of order id
export const getOrdersDetails = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");
  if (!order) return next(new ErrorHandler("Invalid Order Id", 404));
  res.status(200).json({
    success: true,
    order,
  });
});
//Getting all order to admin
export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name");
  res.status(200).json({
    success: true,
    orders,
  });
});
// For Admin basis on id
export const processOrder = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("Invalid Order Id", 404));
  if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
  else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("Food Already Delivered", 400));
  order.save();
  res.status(200).json({
    success: true,
    message: "Status Updated SuccessFully",
  });
});

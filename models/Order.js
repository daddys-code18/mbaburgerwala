import mongoose from "mongoose";
const schema = new mongoose.Schema({
  shippingInfo: {
    hNo: {
      type: String,
      requried: true,
    },
    city: {
      type: String,
      requried: true,
    },
    state: {
      type: String,
      requried: true,
    },
    country: {
      type: String,
      requried: true,
    },
    pinCode: {
      type: Number,
      requried: true,
    },
    phoneNo: {
      type: Number,
      requried: true,
    },
  },
  orderItems: {
    cheeseBurger: {
      price: {
        type: Number,
        requried: true,
      },
      quantity: {
        type: Number,
        requried: true,
      },
    },
    vegCheeseBurger: {
      price: {
        type: Number,
        requried: true,
      },
      quantity: {
        type: Number,
        requried: true,
      },
    },
    burgerWithFries: {
      price: {
        type: Number,
        requried: true,
      },
      quantity: {
        type: Number,
        requried: true,
      },
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },
  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },
  paidAt: Date,
  itemsPrice: {
    type: Number,
    default: 0,
  },
  textPrice: {
    type: Number,
    default: 0,
  },
  shippingCharges: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ["Preparing", "Shipped", "Delivered"],
    default: "Preparing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Order = mongoose.model("Order", schema);

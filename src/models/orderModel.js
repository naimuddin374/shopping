const { Schema, model } = require("mongoose");

const OrderModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    countItem: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1, // 1=PENDING, 2=PROCESSING, 3=DELIVERY, 4=DELIVERED, 5=CANCELED
    },
    coupon: {
      type: String,
      trim: true,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: null,
    },
    shippingAddress: {
      addressType: {
        type: String,
        default: "Home" /** Home / Office / Other */,
      },
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      policeStation: {
        type: String,
        required: true,
      },
      zipcode: {
        type: Number,
        required: true,
      },
      house: {
        type: String,
        required: true,
      },
      specialNote: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

const Order = model("Order", OrderModel);
module.exports = Order;

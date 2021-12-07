const { Schema, model } = require('mongoose')

const OrderModel = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

const OrderDetail = model('OrderDetail', OrderModel)
module.exports = OrderDetail
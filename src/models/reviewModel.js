const { Schema, model } = require('mongoose')

const ReviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 1,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

const Review = model('Review', ReviewSchema)
module.exports = Review
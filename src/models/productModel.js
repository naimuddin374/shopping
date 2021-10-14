const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    sizes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Size',
        }
    ],
    colors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Color',
        }
    ],
    status: {
        type: Number,
        default: 1 // 0=INACTIVE, 1=ACTIVE
    }
}, { timestamps: true })

const Product = model('Product', ProductSchema)
module.exports = Product
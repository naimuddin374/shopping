const { Schema, model } = require('mongoose')

const ColorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, { timestamps: true })

const Color = model('Color', ColorSchema)
module.exports = Color
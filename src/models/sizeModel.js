const { Schema, model } = require('mongoose')

const SizeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Size = model('Size', SizeSchema)
module.exports = Size
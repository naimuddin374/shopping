const { Schema, model } = require('mongoose')

const SliderSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    serial: {
        type: Number,
        default: 1,
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true })

const Slider = model('Slider', SliderSchema)
module.exports = Slider
const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        type: Number,
        default: null,
        trim: true
    },
    status: {
        type: Number,
        default: 1, // 0=INACTIVE, 1=ACTIVE
    },
}, { timestamps: true })

const User = model('User', UserSchema)
module.exports = User
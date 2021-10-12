const { Schema, model } = require('mongoose')

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
}, { timestamps: true })

const Comment = model('Comment', CommentSchema)
module.exports = Comment
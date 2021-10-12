const { Schema, model } = require('mongoose')

const SubCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
}, { timestamps: true })

const SubCategory = model('SubCategory', SubCategorySchema)
module.exports = SubCategory
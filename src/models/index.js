const User = require('./userModel');
const Category = require('./categoryModel');
const SubCategory = require('./subCategoryModel');
const Color = require('./colorModel');
const Size = require('./sizeModel');
const Comment = require('./commentModel');
const Product = require('./productModel');
const Review = require('./reviewModel');
const Order = require('./orderModel');
const OrderDetail = require('./orderDetailModel');
const Slider = require('./sliderModel')

module.exports = {
    User,
    Category,
    SubCategory,
    Color,
    Size,
    Comment,
    Product,
    Review,
    Order,
    OrderDetail,
    Slider
}
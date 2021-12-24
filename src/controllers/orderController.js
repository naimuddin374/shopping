const { Product, User, Order, OrderDetail } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess } = require('../utils');
const { objectIdIsValid } = require('../utils/helper');



// GET LIST
exports.list = async (req, res) => {
    try {
        let result = await Order.find().populate('user');
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}


// GET MY ORDER
exports.myOrder = async (req, res) => {
    try {
        let result = await Order.find({ user: req.user._id }).populate('user');
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// GET BY ID
exports.getById = async (req, res) => {
    try {
        if (!objectIdIsValid(req.params.id)) {
            return badRequest(res, null, 'Invalid ID!');
        }

        let order = await Order.findById(req.params.id).populate('user');
        let orderItem = await OrderDetail.find({ order: req.params.id }).populate('product');
        return actionSuccess(res, { order, orderItem });
    } catch (error) {
        return serverError(res, error);
    }
}



// INSERT
exports.insert = async (req, res) => {
    const { products, note, coupon } = req.body


    // CHECK VALIDATION
    const formField = {
        "products": products
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // FIND PRODUCT
        const pdtIds = [];
        let totalQuantity = 1;

        products.forEach(item => {
            if (item.quantity > 0) {
                pdtIds.push(item._id)
                totalQuantity = totalQuantity + item.quantity
            }
        })

        const selPdt = await Product.find({ $in: pdtIds });
        if (!selPdt) {
            return badRequest(res, null, 'Invalid Product!');
        }


        let totalPrice = 0;
        let totalDiscount = 0;



        selPdt.forEach(item => {
            totalPrice = item.price + totalPrice
            totalDiscount = item.price + totalDiscount
        })


        // SAVE DATA
        const schema = new Order({
            user: req.user._id,
            countItem: pdtIds.length,
            totalPrice,
            totalDiscount,
            totalQuantity,
            deliveryFee: 0,
            note,
            coupon
        });
        let result = await schema.save();


        // SAVE ORDER DETAILS
        selPdt.forEach(item => {
            let quantity = products.filter(p => p._id === item._id)[0]?.quantity

            let orderDetailSchema = new OrderDetail({
                order: schema._id,
                product: item._id,
                price: item.price,
                discount: item.discount,
                totalPrice: (item.price - item.discount) * Number(quantity),
                quantity,
            })
            orderDetailSchema.save()
        })

        return createdSuccess(res, result, 'Order created successfully!');
    } catch (error) {
        return serverError(res, error);
    }
}




// UPDATE
exports.update = async (req, res) => {
    // let { comment, rating } = req.body

    // // CHECK VALIDATION
    // const formField = {
    //     "comment": comment,
    //     "rating": rating,
    // }
    // const validate = validator(formField);
    // if (!validate.isValid) {
    //     return validationError(res, validate.error);
    // }


    // try {
    //     // CHECK ID 
    //     let findData = await Review.findById(req.params.id);
    //     if (!findData) {
    //         return badRequest(res, null, 'Content Not Found!');
    //     }

    //     // UPDATE DATA
    //     await Review.findByIdAndUpdate(req.params.id, { $set: formField }, { new: true, useFindAndModify: false });
    //     const result = await Review.findById(req.params.id).populate(['product', 'user']);
    //     return updatedSuccess(res, result);
    // } catch (error) {
    //     return serverError(res, error);
    // }
    return updatedSuccess(res);
}



// DELETE
exports.remove = async (req, res) => {
    try {
        // CHECK ID
        let findData = await Order.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await Order.findByIdAndDelete(req.params.id)
        await OrderDetail.findOneAndDelete({ order: req.params.id })
        return deleteSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// CHANGE ORDER STATUS
exports.changeStatus = async (req, res) => {
    const status = Number(req.params.status) || 0
    const id = req.params.id || ''

    try {
        // CHECK ID 
        let findData = await Order.findById(id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        await Order.findByIdAndUpdate(id, { $set: { status } }, { new: true, useFindAndModify: false });
        const result = await Order.findById(id).populate(['user']);
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}
const { Product, User, Review } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess } = require('../utils');
const { objectIdIsValid } = require('../utils/helper');



// GET LIST
exports.list = async (req, res) => {
    try {
        let result = await Review.find().populate(['product', 'user']);
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// GET BY ID
exports.getById = async (req, res) => {
    try {
        let result = await Review.findById(req.params.id).populate(['product', 'user']);
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// INSERT
exports.insert = async (req, res) => {
    const { comment, rating, product } = req.body
    const userId = req.user._id


    // CHECK VALIDATION
    let formField = {
        "comment": comment,
        "rating": rating,
        "product": product,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        if (!objectIdIsValid(product)) {
            return badRequest(res, null, 'Invalid Product ID!');
        }

        // FIND PRODUCT
        const findPdt = await Product.findById(product);
        if (!findPdt) {
            return badRequest(res, null, 'Invalid Product!');
        }

        // FIND USER
        const findUser = await User.findById(userId);
        if (!findUser) {
            return badRequest(res, null, 'Invalid User!');
        }


        // SAVE DATA
        const schema = new Review({ ...formField, user: req.user._id });
        await schema.save();
        const result = await Review.findById(schema._id).populate(['product', 'user']);
        return createdSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// UPDATE
exports.update = async (req, res) => {
    let { comment, rating } = req.body

    // CHECK VALIDATION
    const formField = {
        "comment": comment,
        "rating": rating,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // CHECK ID 
        let findData = await Review.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // CHECK CREATOR 
        if (findData.user !== req.user._id) {
            return badRequest(res, null, 'Access Denied!');
        }

        if (findData.status !== 0) {
            return badRequest(res, null, 'Content update permission denied!');
        }


        // UPDATE DATA
        await Review.findByIdAndUpdate(req.params.id, { $set: formField }, { new: true, useFindAndModify: false });
        const result = await Review.findById(req.params.id).populate(['product', 'user']);
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// DELETE
exports.remove = async (req, res) => {
    try {
        // CHECK ID
        let findData = await Review.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await Review.findByIdAndDelete(req.params.id)
        return deleteSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// ACTIVE INACTIVE
exports.activeInactive = async (req, res) => {
    const status = Number(req.params.status) || 0
    const id = req.params.id || ''

    try {
        // CHECK ID 
        let findData = await Review.findById(id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        await Review.findByIdAndUpdate(id, { $set: { status } }, { new: true, useFindAndModify: false });
        const result = await Review.findById(id).populate(['product', 'user']);
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}
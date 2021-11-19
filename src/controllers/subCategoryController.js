const { Category, SubCategory } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess } = require('../utils');
const { objectIdIsValid } = require('../utils/helper');



// GET LIST
exports.list = async (req, res) => {
    try {
        let result = await SubCategory.find().populate('category');
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// GET BY ID
exports.getById = async (req, res) => {
    try {
        let result = await SubCategory.findById(req.params.id).populate('category');
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// INSERT
exports.insert = async (req, res) => {
    let { name, category } = req.body


    // CHECK VALIDATION
    const formField = {
        "name": name,
        "category": category
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        if (!objectIdIsValid(category)) {
            return badRequest(res, null, 'Invalid ID!');
        }

        // FIND CATEGORY
        let findCat = await Category.findById(category);
        if (!findCat) {
            return badRequest(res, null, 'Invalid category!');
        }

        // CHECK UNIQUE
        let findData = await SubCategory.findOne({ name, category });
        if (findData) {
            return badRequest(res, null, 'Content already exists!');
        }

        // SAVE DATA
        const schema = new SubCategory(formField);
        await schema.save();
        const result = await SubCategory.findById(schema._id).populate('category');
        return createdSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// UPDATE
exports.update = async (req, res) => {
    let { name, category } = req.body

    // CHECK VALIDATION
    const formField = {
        "name": name,
        "category": category,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // CHECK ID 
        let findData = await SubCategory.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        await SubCategory.findByIdAndUpdate(req.params.id, { $set: formField }, { new: true, useFindAndModify: false });
        const result = await SubCategory.findById(req.params.id).populate('category');
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}




// DELETE
exports.remove = async (req, res) => {
    try {
        // CHECK ID
        let findData = await SubCategory.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await SubCategory.findByIdAndDelete(req.params.id)
        return deleteSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}

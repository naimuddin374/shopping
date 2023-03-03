const { Category } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess } = require('../utils');
const fileUpload = require('../utils/fileUpload');



// GET LIST
exports.list = async (req, res) => {
    try {
        let result = await Category.find();
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// GET BY ID
exports.getById = async (req, res) => {
    try {
        let result = await Category.findById(req.params.id);
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// INSERT
exports.insert = async (req, res) => {
    let { name } = req.body

    try {
        // CHECK VALIDATION
    const formField = {
        "name": name,
        "image": `uploads/${req.file.filename}`
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }
        
        
        // CHECK UNIQUE
        let findData = await Category.findOne({ name });
        if (findData) {
            return badRequest(res, null, 'Content already exists!');
        }

        // SAVE DATA
        let schema = new Category(formField);
        let result = await schema.save();
        return createdSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// UPDATE
exports.update = async (req, res) => {
    let { name } = req.body

    // CHECK VALIDATION
    const formField = {
        "name": name,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // CHECK ID 
        let findData = await Category.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await Category.findByIdAndUpdate(req.params.id, { $set: formField }, { new: true, useFindAndModify: false })
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}




// DELETE
exports.remove = async (req, res) => {
    try {
        // CHECK ID
        let findData = await Category.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await Category.findByIdAndDelete(req.params.id)
        return deleteSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}

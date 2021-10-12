const bcrypt = require('bcrypt');
const { User } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess } = require('../utils')



// GET LIST
exports.list = async (req, res) => {
    try {
        let result = await User.find();
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// GET BY ID
exports.getById = async (req, res) => {
    try {
        let result = await User.findById(req.params.id);
        return actionSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// INSERT
exports.insert = async (req, res) => {
    let { firstName, lastName, email, password, contact } = req.body


    // CHECK VALIDATION
    const formField = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "contact": contact,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // CHECK EMAIL UNIQUE
        let findData = await User.findOne({ email });
        if (findData) {
            return badRequest(res, null, 'Email address already exist!');
        }


        // GENERATE PASSWORD HASH KEY
        let hash = await bcrypt.hash(password, 11);
        formField.password = hash

        // SAVE DATA
        let user = User(formField);
        let result = await user.save();
        return createdSuccess(res, null, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// UPDATE
exports.update = async (req, res) => {
    let { firstName, lastName, contact, address } = req.body

    // CHECK VALIDATION
    const formField = {
        "firstName": firstName,
        "lastName": lastName,
        "contact": contact,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    formField.address = address;


    try {
        // CHECK ID
        let findData = await User.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await User.findByIdAndUpdate(req.params.id, { $set: formField }, { new: true, useFindAndModify: false })
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}




// DELETE
exports.remove = async (req, res) => {
    try {
        // CHECK ID
        let findData = await User.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await User.findByIdAndDelete(req.params.id)
        return deleteSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}



// UPDATE PASSWORD
exports.changePassword = async (req, res) => {
    let { password, confirmPassword } = req.body

    // CHECK VALIDATION
    const formField = {
        "password": password,
        "confirmPassword": confirmPassword,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }


    try {
        // CHECK EMAIL UNIQUE
        let findData = await User.findById(req.params.id);
        if (!findData) {
            return badRequest(res, null, 'Content Not Found!');
        }

        // UPDATE DATA
        let result = await User.findByIdAndUpdate(req.params.id, { $set: { password } }, { new: true, useFindAndModify: false })
        return updatedSuccess(res, result);
    } catch (error) {
        return serverError(res, error);
    }
}


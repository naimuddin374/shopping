const bcrypt = require('bcrypt');
const { User } = require('../models')
const validator = require('../validators')
const { validationError, serverError, createdSuccess, badRequest, actionSuccess, updatedSuccess, deleteSuccess, tokenGenerator } = require('../utils')




// LOGIN
exports.login = async (req, res) => {
    let { email, password } = req.body

    // CHECK VALIDATION
    const formField = {
        "email": email,
        "password": password,
    }
    const validate = validator(formField);
    if (!validate.isValid) {
        return validationError(res, validate.error);
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return badRequest(res, null, 'Invalid credentials!');
        }

        let hash = await bcrypt.compare(password, user.password)
        if (!hash) {
            return badRequest(res, null, 'Invalid credentials!');
        }

        if (user.status !== 1) {
            return badRequest(res, null, 'Your account has been blocked, please contact our support!');
        }
        const token = await tokenGenerator(user)
        return actionSuccess(res, token, 'Login Successful!');
    } catch (error) {
        return serverError(res, error);
    }
}

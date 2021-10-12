const mongoose = require('mongoose')
const { badRequest } = require('../utils')


module.exports = (req, res, next) => {
    let result = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!result) {
        return badRequest(res, null, 'Invalid ID!')
    }
    return next()
}
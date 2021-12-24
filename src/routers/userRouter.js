const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, changePassword } = require('../controllers/userController')

router.get('/', authenticate, list)
router.get('/:id', [validObjectId, authenticate], getById)
router.post('/', insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)
router.put('/change-password/:id', [validObjectId, authenticate], changePassword)

module.exports = router

const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update } = require('../controllers/productController')

router.post('/', insert)
router.get('/', list)
router.get('/:id', validObjectId, getById)
router.put('/:id', validObjectId, update)
router.delete('/:id', validObjectId, remove)

module.exports = router

const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update } = require('../controllers/sizeController')

router.get('/', list)
router.get('/:id', validObjectId, getById)
router.post('/', authenticate, insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)

module.exports = router

const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, changeStatus } = require('../controllers/orderController')

router.post('/', authenticate, insert)
router.get('/', list)
router.get('/:id', validObjectId, getById)
router.put('/:id', validObjectId, update)
router.delete('/:id', validObjectId, remove)
router.put('/changeStatus/:id/:status', changeStatus)

module.exports = router
